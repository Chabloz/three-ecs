import Component from './Component.js';
import mainloop from "../systems/MainLoop.js";
import { DataTexture, RedFormat, BackSide, DoubleSide, ShaderMaterial}  from '../lib/three/build/three.module.js';

export default class MaterialLifeLikeAutomaton extends Component {
  #birthRuleSet
  #survivalRuleSet
  #grid
  #texture
  #material
  #unregister

  init({
    resolution = 256,
    birthRule = [3],
    survivalRule = [2, 3],
    probAlive = 0.5,
    applyOnlyToId = null,
  } = {}) {
    this.resolution = resolution;
    this.birthRule = birthRule;
    this.survivalRule = survivalRule;
    this.probAlive = probAlive;

    this.#birthRuleSet = new Set(birthRule);
    this.#survivalRuleSet = new Set(survivalRule);

    // Build of the initial grid of the Game of Life like automaton (data saved on the red channel)
    this.#grid = new Uint8Array(resolution * resolution);
    for (let i = 0; i < this.#grid.length; i++) {
      this.#grid[i] = Math.random() < this.probAlive ? 1 : 0;
    }

    this.#texture = new DataTexture(this.#grid, this.resolution, this.resolution);
    this.#texture.format = RedFormat;
    this.#texture.needsUpdate = true;

    this.#material = new ShaderMaterial({
      uniforms: {
        tex: {value: this.#texture},
        time: {value: 0},
        resolution: {value: this.resolution}
      },

      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tex;
        uniform float time;

        vec3 hsb2rgb(in vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          rgb = rgb * rgb * (3.0 - 2.0 * rgb);
          return c.z * mix(vec3(1.0), rgb, c.y);
        }

        void main() {
          vec4 data = texture2D(tex, vUv);
          vec2 toCenter = vec2(0.5) - vUv;
          float radius = length(toCenter);

          vec3 color = hsb2rgb(vec3(abs(cos(time / 8000.)), radius, 1.));
          color *= vec3(data.r * 255.);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    // this.#material.side = BackSide;
    this.#material.side = DoubleSide;

    this.#unregister = mainloop.register((dt, t) => this.tick(dt, t));

    // apply only to id or apply to all object3d of the entity
    if (applyOnlyToId) {
      this.entity.getObject3D(applyOnlyToId).material = this.#material;
    } else {
      this.entity.object3D.traverse(child => {
        if (child.material) child.material = this.#material;
      })
    }
  }

  tick(dt, t) {
    const toSwitch = [];
    for (let i = 0; i < this.#grid.length; i++) {
      let n = 0;
      n += this.#grid[i + 1] ?? 0;
      n += this.#grid[i - 1] ?? 0;
      n += this.#grid[i + this.resolution] ?? 0;
      n += this.#grid[i + this.resolution + 1] ?? 0;
      n += this.#grid[i + this.resolution - 1] ?? 0;
      n += this.#grid[i - this.resolution] ?? 0;
      n += this.#grid[i - this.resolution + 1] ?? 0;
      n += this.#grid[i - this.resolution - 1] ?? 0;
      if ((!this.#grid[i] && this.#birthRuleSet.has(n))
        || (this.#grid[i] && !this.#survivalRuleSet.has(n))) {
        toSwitch.push(i);
      }
    }
    for (const i of toSwitch) {
      this.#grid[i] = this.#grid[i] ? 0 : 1;
    }
    this.#material.uniforms.time.value = t;
    this.#texture.needsUpdate = true;
  }

  remove() {
    this.#unregister();
  }

}

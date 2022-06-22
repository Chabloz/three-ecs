import Component from './Component.js';
import { DirectionalLight, Color }  from '../lib/three/build/three.module.js';
import ThreeEntity from '../entities/ThreeEntity.js';

export default class LightDirectional extends Component {
  #light

  init({
    color = 0x404040,
    intensity = 1,
    target = null,
  } = {}) {
    this.#light = new DirectionalLight();
    this.update({color, intensity, target});
    this.entity.setObject3D(this.#light, this.id);
  }

  update({color = null, intensity = null, target = null} = {}) {
    if (intensity) {
      this.intensity = intensity;
      this.#light.intensity = this.intensity;
    }
    if (color) {
      this.color = color;
      this.#light.color = new Color(this.color);
    }
    if (target) {
      this.target = target;
      this.#light.target = this.target.object3D;
    }
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}
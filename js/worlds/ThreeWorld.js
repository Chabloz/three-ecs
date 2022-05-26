import ThreeEntity from "../entities/ThreeEntity.js";
import World from "./World.js";
import * as THREE from '../lib/three/build/three.module.js';

export default class ThreeWorld extends World {

  constructor() {
    super();

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio)

    // todo make a camera component (and use the active cam as the scene cam)
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5;

    document.body.appendChild(this.renderer.domElement);

    window.addEventListener( 'resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
    window.dispatchEvent(new Event('resize'));
  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }

  create({id = null, components = [], parent = null} = {}) {
    const e = new ThreeEntity({id, parent: parent ?? this.scene, world: this});
    for (let componentParam of components) {
      if (!Array.isArray(componentParam)) {
        componentParam = [componentParam, {}];
      }
      const [component, args] = componentParam;
      e.addComponent(component, args);
    }
    this.add(e);
    return e;
  }


}
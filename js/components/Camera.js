import Component from './Component.js';
import { PerspectiveCamera } from '../lib/three/build/three.module.js';

export default class Camera extends Component {
  #camera

  init({
    fov = 75,
    near = 0.1,
    far = 2000,
    aspect = window.innerWidth / window.innerHeight,
    active = true
  } = {}) {
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = aspect;
    this.active = active;
    this.#camera = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    this.entity.setObject3D(this.#camera, this.id);
    if (this.active) this.entity.world.setCamera(this.#camera);
  }

  update({active = null} = {}) {
    if (active !== null && active !== this.active) {
      this.active = !this.active;
      if (this.active) this.entity.world.setCamera(this.#camera);
    }
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}
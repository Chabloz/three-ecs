import Component from "./Component.js";
import * as THREE from '../lib/three/build/three.module.js';
import mainloop from "../systems/MainLoop.js";

export default class LookAt extends Component {
  #targetWorldPosition
  #unregister

  init({target}) {
    this.target = target.object3D;
    this.#targetWorldPosition = new THREE.Vector3();
    this.#unregister = mainloop.register((dt, t) => this.tick(dt, t));
  }

  update({target}) {
    this.target = target;
  }

  remove() {
    this.#unregister();
    this.#unregister = null;
  }

  tick(dt, t) {
    this.target.getWorldPosition(this.#targetWorldPosition);
    this.entity.object3D.lookAt(this.#targetWorldPosition);
  }

}
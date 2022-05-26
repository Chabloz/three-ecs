import Component from "./Component.js";
import * as THREE from '../lib/three/build/three.module.js';
import mainloop from "../systems/MainLoop.js";

export default class LookAt extends Component {

  init({target}) {
    this.target = target;
    this.tick = this.tick.bind(this);
    this.targetWorldPosition = new THREE.Vector3();
    mainloop.registerUpdate(this.tick);
  }

  remove() {
    mainloop.unregisterUpdate(this.tick);
  }

  tick(dt, t) {
    this.target.getWorldPosition(this.targetWorldPosition);
    this.entity.object3D.lookAt(this.targetWorldPosition);
  }

}
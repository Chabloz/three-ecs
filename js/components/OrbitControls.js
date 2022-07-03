import Component from "./Component.js"
import { OrbitControls as ThreeOrbitControls } from '../lib/three/examples/jsm/controls/OrbitControls.js';
import mainloop from '../systems/MainLoop.js'
import { Vector3 } from '../lib/three/build/three.module.js'

export default class OrbitControls extends Component {
  #unregister
  #controls
  #camera

  init({
    target = new Vector3(0, 0, 0),
    autoRotate = false,
  }) {
    // In OrbitControls from THREE, The camera must not be a child of another object,
    // unless that object is the scene itself.
    // Here we copy the parent's position to the camera to fix this.
    // because the camera is a child of a group (see #group in ThreeEntity).
    this.#camera = this.entity.world.getCamera();
    this.#camera.position.copy(this.entity.object3D.position);
    this.entity.object3D.position.copy(new Vector3(0, 0, 0));

    this.#controls = new ThreeOrbitControls(
      this.#camera,
      this.entity.world.renderer.domElement
    );
    this.update({ autoRotate, target });
    this.#unregister = mainloop.register((dt, t) => this.tick());
  }

  update({ autoRotate = null, target = null}) {
    if (target) {
      this.target = target;
      this.#controls.target.copy(this.target);
    }
    if (autoRotate) {
      this.autoRotate = autoRotate;
      this.#controls.autoRotate = autoRotate;
    }
  }

  remove() {
    this.#controls.dispose();
    this.#unregister();
  }

  tick(dt, t) {
    this.#controls.update();
  }

}
import ThreeEntity from "../entities/ThreeEntity.js";
import World from "./World.js";
import {Scene, WebGLRenderer, PerspectiveCamera, Color} from '../lib/three/build/three.module.js';

// some default system for the World:
import mainloop from '../systems/MainLoop.js';

export default class ThreeWorld extends World {

  constructor({
    autoResize = true,
    backgroundColor = 'white',
  } = {}) {
    super();

    this.autoResize = autoResize;
    this.scene = new Scene();
    this.scene.background = new Color(backgroundColor);
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.setDefautlCamera();

    document.body.appendChild(this.renderer.domElement);
    mainloop.registerRender(() => this.render());
  }

  setDefautlCamera() {
    this.activeCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    if (!this.autoResize) return;
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.activeCamera.aspect = width / height;
      this.activeCamera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  getCamera() {
    return this.activeCamera;
  }

  setCamera(camera) {
    this.activeCamera = camera;
  }

  start() {
    if (this.autoResize) window.dispatchEvent(new Event('resize'));
    mainloop.start();
  }

  render() {
    this.renderer.render(this.scene, this.activeCamera);
  }

  create(...components) {
    return this.createEntity({components});
  }

  createEntity({id = null, components = [], parent = null} = {}) {
    const entity = new ThreeEntity({id, parent: parent ?? this.scene, world: this});

    for (let componentParam of components) {
      if (!Array.isArray(componentParam)) {
        componentParam = [componentParam, {}, undefined];
      }
      const [component, args, id] = componentParam;
      entity.addComponent(component, args, id);
    }

    this.add(entity);
    return entity;
  }


}
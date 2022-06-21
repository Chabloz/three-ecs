import ThreeEntity from "../entities/ThreeEntity.js";
import World from "./World.js";
import {Scene, WebGLRenderer, PerspectiveCamera, Color, sRGBEncoding} from '../lib/three/build/three.module.js';


// some default system for the World:
import mainloop from '../systems/MainLoop.js';

export default class ThreeWorld extends World {

  constructor({
    autoResize = true,
    backgroundColor = 'white',
    renderOpt = {
      logarithmicDepthBuffer: false,
      antialias: true,
      outputEncoding: sRGBEncoding
    },
  } = {}) {
    super();

    this.autoResize = autoResize;
    this.scene = new Scene();
    this.scene.background = new Color(backgroundColor);
    this.renderer = new WebGLRenderer(renderOpt);
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

  stop() {
    mainloop.stop();
  }

  render() {
    this.renderer.render(this.scene, this.activeCamera);
  }

  createEntity({id = null, components = [], parent = null} = {}) {
    const theParent = parent instanceof ThreeEntity ? parent.object3D : this.scene;
    const entity = new ThreeEntity({id, parent: theParent, world: this});
    this.addComponentsToEntity(entity, components);
    this.add(entity);

    if (parent instanceof ThreeEntity) {
      parent.addChild(entity)
    }

    return entity;
  }

  remove(idOrEntity) {
    const entity = idOrEntity instanceof ThreeEntity ? idOrEntity : this.get(idOrEntity);
    for (const child of entity.children) this.remove(child);
    super.remove(entity);
  }

}
import Entity from "./Entity.js";
import * as THREE from '../lib/three/build/three.module.js';

export default class ThreeEntity extends Entity {
  #groupMap
  #group
  parent

  constructor({id = null, parent, world}) {
    super({id, world});
    this.#group = new THREE.Group();
    this.#groupMap = new Map();
    this.parent = parent;
    parent.add(this.#group);
  }

  remove() {
    super.remove();
    this.parent.remove(this.#group);
  }

  // Think of all those is needed, or a sinmple unique mesh is enough
  setObject3D(object3D, name = 'mesh') {
    // if allready a object3D with this name, remove it first
    if (this.#groupMap.has(name)) {
      this.#group.remove(this.#groupMap.get(name));
    }

    this.#group.add(object3D);
    this.#groupMap.set(name, object3D);
  }

  removeObject3D(name = 'mesh') {
    return this.#group.remove(this.#groupMap.get(name));
  }

  getObject3D(name = 'mesh') {
    return this.#groupMap.get(name);
  }

  get object3D() {
    return this.#group;
  }

  get objects3D() {
    return [...this.#groupMap.values()];
    //return this.#group.children;
  }

  set object3D(object3D) {
    this.setObject3D(object3D);
  }

}
import Entity from "./Entity.js";
import * as THREE from '../lib/three/build/three.module.js';

export default class ThreeEntity extends Entity {
  #childrenMap
  #groupMap
  #group
  parent

  constructor({id = null, parent, world}) {
    super({id, world});
    this.#group = new THREE.Group();
    this.#groupMap = new Map();
    this.#childrenMap = new Map();
    this.parent = parent;
    parent.add(this.#group);
  }

  remove() {
    super.remove();
    this.parent.remove(this.#group);
  }

  setObject3D(object3D, name) {
    // if allready a object3D with this name, remove it first
    if (this.#groupMap.has(name)) {
      this.#group.remove(this.#groupMap.get(name));
    }
    this.#group.add(object3D);
    this.#groupMap.set(name, object3D);
  }

  removeObject3D(name) {
    return this.#group.remove(this.#groupMap.get(name));
  }

  getObject3D(name) {
    return this.#groupMap.get(name);
  }

  get object3D() {
    return this.#group;
  }

  get objects3D() {
    return this.#group.children;
  }

  setMaterial(material, applyOnlyToId = null) {
    if (applyOnlyToId) {
      const child = this.#groupMap.get(applyOnlyToId);
      child.material.dispose();
      child.material = material;
    } else {
      this.#group.traverse(child => {
        if (child.material) {
          child.material.dispose();
          child.material = material;
        }
      })
    }
  }

  addChild(child) {
    if (!(child instanceof ThreeEntity)) throw new Error('The child must be a ThreeEntity');
    this.#childrenMap.set(child.id, child);
    child.once('removed', () => this.removeChild(child.id));
  }

  getChild(id) {
    return this.#childrenMap.get(id);
  }

  removeChild(id) {
    this.#childrenMap.delete(id);
  }

  get children() {
    return this.#childrenMap.values();
  }

}
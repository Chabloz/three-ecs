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

  //todo iterator function to loop over all mesh in the group ?

  remove() {
    super.remove();
    this.parent.remove(this.#group);
  }

  setObject3D(object3D, name = 'mesh') {
    // if allready a object3D with this name, remove it first
    if (this.#groupMap.has(name)) {
      this.#group.remove(this.#groupMap.get(name));
    }

    this.#group.add(object3D);
    this.#groupMap.set(name, object3D);
  }

  getObject3D(name = 'mesh') {
    return this.#groupMap.get(name);
  }

  // By default take the 'mesh' named object3D of the group
  get object3D() {
    return this.#group;
    //return this.#groupMap.get('mesh');
  }

  set object3D(object3D) {
    this.setObject3D(object3D);
  }

}
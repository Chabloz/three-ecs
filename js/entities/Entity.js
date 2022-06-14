import Component from '../components/Component.js';
import { generateUUID } from '../utils/Math.js';

export default class Entity {
  #components
  #listeners

  constructor({id = null, world}) {
    this.id = id ?? generateUUID();
    this.#components = new Map();
    this.#listeners = new Map();
    this.world = world;
  }

  remove() {
    // call the remove method of all the components used by this entity
    for (const [classname, componentSet] of this.#components) {
      for (const component of componentSet) {
        component.remove();
      }
    }
  }

  addListener(event, callback) {
    let callbackSet = this.#listeners.get(event);
    // If it is the first callback for this event, we create a set storage
    if (!callbackSet) {
      callbackSet = new Set();
      this.#listeners.set(event, callbackSet);
    }
    callbackSet.add(callback);

    // Return a removeListener function for conveniance
    return () => this.removeListener(event, callback);
  }

  removeListener(event, callback) {
    const callbackSet = this.#listeners.get(event);
    if (!callbackSet) return false;
    callbackSet.delete(callback);
  }

  emit(event, data = {}) {
    const callbackSet = this.#listeners.get(event);
    if (!callbackSet) return;
    for (const callback of callbackSet) {
      callback({entity: this, ...data});
    }
  }

  addComponent(TheComponent, args = {}, id) {
    const component = new TheComponent(this, id);
    if (!(component instanceof Component)) {
      throw 'The component is not an instance of Component';
    }

    let componentSet = this.#components.get(component.className);

    // If it is the first component of this type, we create a set storage
    // for all the components of the same type
    if (!componentSet) {
      componentSet = new Set();
      this.#components.set(component.className, componentSet);
    }

    componentSet.add(component);
    component.init(args);

    return component;
  }

  removeComponent(component) {
    // if we are removing by class name, remove all componants of this class
    if (!(component instanceof Component)) {
      return this.removeComponentByClassName(component);
    }

    // Otherwise delete the specific component
    const componentSet = this.#components.get(component.className);
    if (!componentSet) return false;

    const res = componentSet.delete(component);

    // if the component was in the set, call it's remove method
    // (to do internall component cleanup if needed)
    if (res) component.remove();

    // if the set is empty, no need to keep it
    if (componentSet.size == 0) {
      this.#components.delete(component.className);
    }

    return res;
  }

  removeComponentByClassName(className) {
    const componentSet = this.#components.get(className);
    if (!componentSet) return false;

    // remove them from the set
    this.#components.delete(className);

    // and call the remove method of all the removed components
    // (to do internall component cleanup if needed)
    for (const component of componentSet) {
      component.remove();
    }

    return true;
  }

  hasComponent(component) {

    // if we are looking by the class name, just check if a set exists
    if (!(component instanceof Component)) {
      return this.#components.has(component);
    }

    //if we are checking if a component is in there, get the set and check
    const componentSet = this.#components.get(component.className);
    if (!componentSet) return false;
    return componentSet.has(component);
  }

  getComponent(className) {
    const componentSet = this.#components.get(className);
    if (!componentSet) {
      throw `No ${className} component on the entity`;
    }

    // if there is only one component in the set, we return it
    if (componentSet.size == 1) {
      const setIter = componentSet.values();
      return setIter.next().value;
    }

    //TODO get by id

    // otherwise return the set of all components of the same class
    return this.#components.get(className);
  }

}
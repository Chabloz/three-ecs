import Component from './Component.js';
import { generateUUID } from './utils/Math.js';

export default class Entity {
  #components
  #listeners

  constructor(id = generateUUID()) {
    this.id = id;
    this.#components = new Map();
    this.#listeners = new Map();
  }

  remove() {
    for (const [classname, componentSet] of this.#components) {
      for (const component of componentSet) {
        component.remove();
      }
    }
  }

  addListener(event, callback) {
    let eventSet = this.#listeners.get(event);
    // If it is the first callback for this event, we create a set storage
    if (!eventSet) {
      eventSet = new Set();
      this.#listeners.set(event, eventSet);
    }
    eventSet.add(callback);

    // Return a removeListener function for conveniance
    return () => this.removeListener(event, callback);
  }

  removeListener(event, callback) {
    const eventSet = this.#listeners.get(event);
    if (!eventSet) return false;
    eventSet.delete(callback);
  }

  emit(event) {
    const eventSet = this.#listeners.get(event);
    if (!eventSet) return;
    for (const callback of eventSet) {
      callback(this);
    }
  }

  get components() {
    return this.#components;
  }

  addComponent(Component, args) {
    const component = new Component(this);
    let componentSet = this.#components.get(component.className);

    // If it is the first component of this type, we create a set storage
    // for all the components of the same type
    if (!componentSet) {
      componentSet = new Set();
      this.#components.set(component.className, componentSet);
    }

    componentSet.add(component);

    component.init(args)

    return component;
  }

  removeComponent(component) {
    // if we are removing by class name, remove all componants of this class
    if (!(component instanceof Component)) {
      return this.removeComponentByClassName(component);
    }

    // Otherwise delet the specific component
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
    return this.#components.get(className);
  }

}
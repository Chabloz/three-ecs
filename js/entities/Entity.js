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
    if (component instanceof Component) {
      return this.removeComponentByInstance(component);
    }
    if (typeof component == 'string') {
      return this.removeComponentById(component);
    }
    if (component?.name) {
      return this.removeComponentByClass(component);
    }
    return false;
  }

  removeComponentByInstance(component) {
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

  removeComponentByClass(theClass) {
    return this.removeComponentByClassName(theClass.name);
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

  removeComponentById(id) {
    for (const componentSet of this.#components.values()) {
      for (const component of componentSet) {
        if (component.id == id) {
          return this.removeComponent(component);
        }
      }
    }
    return false;
  }

  hasComponent(component) {
    // if we are removing by class name, remove all componants of this class
    if (component instanceof Component) {
      return this.hasComponentInstance(component);
    }
    if (typeof component == 'string') {
      return this.hasComponentId(component);
    }
    if (component?.name) {
      return this.hasComponentClass(component);
    }
    return false;
  }

  hasComponentInstance(component) {
    //if we are checking if a component is in there, get the set and check
    const componentSet = this.#components.get(component.className);
    if (!componentSet) return false;
    return componentSet.has(component);
  }

  hasComponentId(id) {
    for (const componentSet of this.#components.values()) {
      for (const component of componentSet) {
        if (component.id == id) {
          return true;
        }
      }
    }
    return false;
  }

  hasComponentClass(theClass) {
    return this.hasComponentClassName(theClass.name);
  }

  hasComponentClassName(className) {
    return this.#components.has(className);
  }

  getComponent(component) {
    if (typeof component == 'string') { // || component instanceof String ?
      return this.getComponentById(component);
    }
    if (component?.name) {
      return this.getComponentByClass(component);
    }
  }

  getComponentByClass(theClass) {
    return this.getComponentByClassName(theClass.name);
  }

  getComponentByClassName(className) {
    const componentSet = this.#components.get(className);
    if (!componentSet) return;
    // if there is only one component in the set, we return it
    if (componentSet.size == 1) {
      const setIter = componentSet.values();
      return setIter.next().value;
    }

    // otherwise return the set of all components of the same class
    return this.#components.get(className);
  }



  getComponentById(id) {
    for (const componentSet of this.#components.values()) {
      for (const component of componentSet) {
        if (component.id == id) {
          return component;
        }
      }
    }
  }

  get components() {
    return this.#components;
  }

  //todo Update component ?

}
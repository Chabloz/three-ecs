import { generateUUID } from '../utils/Math.js';

export default class Component {
  #entity
  #id

  constructor(entity, id) {
    this.#entity = entity;
    this.#id = id ?? generateUUID();
  }

  get entity() {
    return this.#entity;
  }

  get id() {
    return this.#id;
  }

  get(property) {
     // To implement in a component if the property is stored elsewhere
    return this[property];
  }

  init(args) {
    // To implement in a component
  }

  update(args) {
    // To implement in a component (but code a default version here ?)
  }

  remove() {
    // To implement in a component
  }

  get className() {
    return this.constructor.name;
  }

}
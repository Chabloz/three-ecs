import { generateUUID } from '../utils/Math.js';

export default class Component {

  constructor(entity, id) {
    this.entity = entity;
    this.id = id ?? generateUUID();
  }

  get className() {
    return this.constructor.name;
  }

  init(args) {

  }

  update(args) {

  }

  remove() {

  }

}
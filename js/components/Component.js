export default class Component {

  constructor(entity) {
    this.entity = entity;
  }

  get className() {
    return this.constructor.name;
  }

  init(args) {

  }

  remove() {

  }

}
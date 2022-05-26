import Entity from './entities/Entity.js';

export default class World {
  #entitiesSet

  constructor() {
    this.#entitiesSet = new Set();
  }

  add(entities) {
    if (!Array.isArray(entities)) entities = [entities];
    for (const entity of entities) {
      if (!(entity instanceof Entity)) throw 'The entity is not an instance of Entity';
      this.#entitiesSet.add(entity);
    }
  }

  remove(entities) {
    if (!Array.isArray(entities)) entities = [entities];
    for (const entity of entities) {
      if (this.#entitiesSet.delete(entity)) entity.remove();
    }
  }

  has(entity) {
    return this.#entitiesSet.has(entity);
  }

  // TODO: call draw only in Render system
  draw(ctx) {
    for (const entity of this.#entitiesSet) {
      entity.draw(ctx);
    }
  }

}
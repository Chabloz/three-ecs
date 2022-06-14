import Entity from '../entities/Entity.js';

export default class World {
  #entitiesSet

  constructor() {
    this.#entitiesSet = new Set();
  }

  create(...components) {
    return this.createEntity({components});
  }

  createEntity({id = null, components = []} = {}) {
    const entity = new Entity({id, world: this});

    for (let componentParam of components) {
      // handle the special case of a no args component
      if (!Array.isArray(componentParam)) {
        componentParam = [componentParam, {}, undefined];
      }
      const [component, args, id] = componentParam;

      entity.addComponent(component, args, id);
    }

    this.add(entity);
    return entity;
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
      if (this.#entitiesSet.delete(entity)) {
        // emit a "removed" event on the entity (usefull for others entities that are listening to this one)
        entity.emit('removed', {world: this});
        entity.remove();
      }
    }
  }

  has(entity) {
    return this.#entitiesSet.has(entity);
  }

}
import Entity from '../entities/Entity.js';

export default class World {
  #entitiesMap

  constructor() {
    this.#entitiesMap = new Map();
  }

  create(...components) {
    return this.createEntity({components});
  }

  createEntity({id = null, components = []} = {}) {
    const entity = new Entity({id, world: this});
    this.addComponentsToEntity(entity, components);
    this.add(entity);
    return entity;
  }

  addComponentsToEntity(entity, components) {
    for (let componentParam of components) {
      // handle the special case of a no args component
      if (!Array.isArray(componentParam)) {
        componentParam = [componentParam, {}, undefined];
      }
      const [component, args, id] = componentParam;
      entity.addComponent(component, args, id);
    }
  }

  add(entity) {
    if (!(entity instanceof Entity)) throw 'The entity is not an instance of Entity';
    if (this.#entitiesMap.has(entity.id)) throw 'An entity with this id already exists';
    this.#entitiesMap.set(entity.id, entity);
    entity.emit('added', {world: this});
  }

  remove(idOrEntity) {
    const entity = idOrEntity instanceof Entity ? idOrEntity : this.#entitiesMap.get(idOrEntity);
    if (this.#entitiesMap.delete(entity.id)) {
      entity.emit('removed', {world: this});
      entity.remove();
    }
  }

  has(idOrEntity) {
    return this.#entitiesMap.has(
      idOrEntity instanceof Entity ? idOrEntity.id : idOrEntity
    );
  }

  get(id) {
    return this.#entitiesMap.get(id);
  }

  get entities() {
    return this.#entitiesMap.values();
  }

}
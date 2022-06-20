import Component from "./Component.js";

export default class ListenTo extends Component {
  #remListenerRemove
  #remlistener

  init({
    target,
    event = 'click',
    eventOnSelf = 'click'
  }) {
    this.target = target;
    this.eventOnSelf = eventOnSelf;
    this.event = event;

    this.#remListenerRemove = this.target.addListener('removed', () => this.onTargetRemoved());
    this.#remlistener = this.target.addListener(this.event, evt => this.onEvent(evt));
  }

  update({
    target = null,
    event = null,
    eventOnSelf = null
  }) {
    if (eventOnSelf) this.eventOnSelf = eventOnSelf;

    let mustRebind = false;
    if (target && target != this.target) {
      mustRebind= true;
      this.target = target;
    }
    if (event && event != this.event) {
      mustRebind= true;
      this.event = event;
    }
    if (mustRebind) {
      this.#remListenerRemove();
      this.#remlistener();
      this.#remListenerRemove = this.target.addListener('removed', () => this.onTargetRemoved());
      this.#remlistener = this.target.addListener(this.event, () => this.onEvent);
    }
  }

  onTargetRemoved() {
    this.#remListenerRemove();
    this.#remlistener();
    this.target = null;
    this.#remlistener = null;
    this.#remListenerRemove = null;
  }

  onEvent(evt) {
    // propagate the original event to the entity
    // and add a reference of the original entity to the event data
    this.entity.emit(this.eventOnSelf, {
      ...evt,
      entity: this.entity,
      originEntity: this.target
    });
  }

  remove() {
    if (!this.target) return;
    this.#remListenerRemove();
    this.#remlistener();
  }

}
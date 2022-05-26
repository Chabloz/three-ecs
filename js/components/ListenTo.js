import Component from "./Component.js";

export default class ListenTo extends Component {

  init({targetEntity, event = 'click', eventOnSelf = 'click'}) {
    this.targetEntity = targetEntity;
    this.eventOnSelf = eventOnSelf;
    this.event = event;

    this.onEvent = this.onEvent.bind(this);
    this.onTargetRemoved = this.onTargetRemoved.bind(this);

    // when the target entity is removed, remove the reference here
    // (to let the garbage collection do his job)
    this.remListenerRemove = this.targetEntity.addListener('removed', this.onTargetRemoved);
    this.remlistener = this.targetEntity.addListener(this.event, this.onEvent);
  }

  update({targetEntity = null, event = null, eventOnSelf = null}) {
    if (eventOnSelf) this.eventOnSelf = eventOnSelf;

    let mustRebind = false;
    if (targetEntity && targetEntity != this.targetEntity) {
      mustRebind= true;
      this.targetEntity = targetEntity;
    }
    if (event && event != this.event) {
      mustRebind= true;
      this.event = event;
    }
    if (mustRebind) {
      this.remListenerRemove();
      this.remlistener();
      this.remListenerRemove = this.targetEntity.addListener('removed', this.onTargetRemoved);
      this.remlistener = this.targetEntity.addListener(this.event, this.onEvent);
    }
  }

  onTargetRemoved() {
    this.remListenerRemove();
    this.remlistener();
    this.targetEntity = null;
    this.remlistener = null;
    this.remListenerRemove = null;
  }

  onEvent() {
    this.entity.emit(this.eventOnSelf);
  }

  remove() {
    if (!this.targetEntity) return;
    this.remListenerRemove();
    this.remlistener();
  }

}
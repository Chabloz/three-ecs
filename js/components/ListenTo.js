import Component from "./Component.js";

export default class ListenTo extends Component {

  init({targetEntity, event, eventOnSelf}) {
    this.targetEntity = targetEntity;
    this.eventOnSelf = eventOnSelf;
    this.onEvent = this.onEvent.bind(this);
    // todo : What if target entity is no more ? remove this component ?
    this.removeListener  = this.targetEntity.addListener(event, this.onEvent);
  }

  update({targetEntity = null, event = null, eventOnSelf = null}) {
    if (eventOnSelf) this.eventOnSelf = eventOnSelf;
    $mustRebind = false;
    if (targetEntity && targetEntity != this.targetEntity) {
      $mustRebind= true;
      this.targetEntity = targetEntity;
    }
    if (event && event != this.event) {
      $mustRebind= true;
      this.event = event;
    }
    if ($mustRebind) {
      this.removeListener();
      this.removeListener  = this.targetEntity.addListener(event, this.onEvent);
    }
  }

  onEvent() {
    this.entity.emit(this.eventOnSelf);
  }

  remove() {
    this.removeListener();
  }

}
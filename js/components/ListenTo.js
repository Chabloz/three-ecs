import Component from "./Component.js";

export default class ListenTo extends Component {

  init({targetEntity, event, eventOnSelf}) {
    this.targetEntity = targetEntity;
    this.eventOnSelf = eventOnSelf;
    this.onEvent = this.onEvent.bind(this);

    // todo : What if target entity is no more ? remove this component ?
    this.removeListener  = this.targetEntity.addListener(event, this.onEvent);
  }

  onEvent() {
    this.entity.emit(this.eventOnSelf);
  }

  remove() {
    this.removeListener();
  }

}
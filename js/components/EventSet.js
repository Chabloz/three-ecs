import Component from './Component.js';
import tweens from "../systems/Tween.js";

export default class EventSet extends Component {

  init({
    component,
    property,
    value,
    event = 'click',
  }) {
    this.component = component;
    this.property = property;
    this.value = value;
    this.event = event;
    this.removeOnce = this.entity.once(event, evt => {
      this.targetComponent = this.entity.getComponent(this.component);
      this.targetComponent.update({[this.property]: this.value});
    });
  }

  remove() {
    this.removeOnce();
  }

}
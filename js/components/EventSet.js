import Component from './Component.js';
import tweens from "../systems/Tween.js";

export default class EventSet extends Component {
  #removeOnce

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
    this.#removeOnce = this.entity.once(event, evt => {
      const targetComponent = this.entity.getComponent(this.component);
      targetComponent.update({[this.property]: this.value});
    });
  }

  remove() {
    this.#removeOnce();
  }

}
import Component from './Component.js';
import tweens from "../systems/Tween.js";

export default class EventSet extends Component {
  #removeOnce

  init({
    component,
    property,
    value,
    event = 'click',
    multipleSet = false,
  }) {
    this.component = component;
    this.property = property;
    this.value = value;
    this.event = event;
    this.multipleSet = multipleSet;

    this.#removeOnce = this.entity.once(this.event, evt => {
      this.onEvent();
    });
  }

  onEvent() {
    const targetComponent = this.entity.getComponent(this.component);
    // if value is a function, call it to get the value
    const newValue = typeof this.value === 'function' ? this.value() : this.value;
    targetComponent.update({[this.property]: newValue});
    if (this.multipleSet) {
      this.#removeOnce = this.entity.once(this.event, evt => {
        this.onEvent();
      });
    }
  }

  remove() {
    this.#removeOnce();
  }

}
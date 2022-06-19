import Component from './Component.js';
import tweens from "../systems/Tween.js";

export default class Animation extends Component {

  init({
    component,
    property,
    from = null,
    to,
    duration = 1000,
    ease = 'linear',
    loop = false,
    yoyo = false,
    startEvent = null,
    endEvent = null,
  }) {
    const createTween = () => {
      this.targetComponent = this.entity.getComponent(component);
      this.targetProperty = property;
      this.endEvent = endEvent;
      this.tween = tweens.create({
        duration,
        from: from === null ? this.targetComponent.get(this.targetProperty) : from,
        to,
        loop,
        yoyo,
        ease,
        animate : progress => this.animate(progress),
        atEnd : t => this.atEnd()
      });
    }
    if (startEvent) {
      this.entity.once(startEvent, () => createTween());
    } else {
      createTween();
    }
  }

  atEnd() {
    this.entity.emit(this.endEvent);
  }

  animate(progress) {
    this.targetComponent.update({[this.targetProperty]: progress});
  }

  create() {

  }

  remove() {
    tweens.delete(this.tween);
  }

}

/*

*/
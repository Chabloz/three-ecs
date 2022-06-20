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
    this.component = component;
    this.property = property;
    this.from = from;
    this.to = to;
    this.duration = duration;
    this.ease = ease;
    this.loop = loop;
    this.yoyo = yoyo;
    this.startEvent = startEvent;
    this.endEvent = endEvent;
    this.removeOnce = () => {};

    if (startEvent) {
      this.removeOnce = this.entity.once(startEvent, evt => {
        this.createTween(evt?.timeOverrun);
      });
    } else {
      this.createTween();
    }
  }

  createTween(startAtTime = 0) {
    this.targetComponent = this.entity.getComponent(this.component);
    this.tween = tweens.create({
      duration: this.duration,
      from: this.from === null ? this.targetComponent.get(this.property) : this.from,
      to: this.to,
      loop: this.loop,
      yoyo: this.yoyo,
      ease: this.ease,
      startAtTime,
      animate : progress => this.animate(progress),
      atEnd : timeOverrun => this.atEnd(timeOverrun)
    });
  }

  atEnd(timeOverrun) {
    this.entity.emit(this.endEvent, {timeOverrun});
  }

  animate(progress) {
    this.targetComponent.update({[this.property]: progress});
  }

  remove() {
    tweens.delete(this.tween);
    this.removeOnce();
  }

}
import Component from './Component.js';
import tweens from "../systems/Tween.js";

export default class Animation extends Component {
  #removeOnce
  #targetComponent
  #tween

  init({
    component,
    property,
    from = null,
    to,
    duration = 1000,
    ease = 'linear',
    loop = false,
    yoyo = false,
    startEvent = 'added',
    endEvent = null,
    multipleStart = false,
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
    this.multipleStart = multipleStart;

    this.#removeOnce = this.entity.once(startEvent, evt => {
      this.createTween(evt?.timeOverrun);
    });
  }

  createTween(startAtTime = 0) {
    // TODO handle the case of the target component being removed ? (we need to stop the tween)
    this.#targetComponent = this.entity.getComponent(this.component);
    tweens.delete(this.#tween);
    this.#tween = tweens.create({
      duration: this.duration,
      from: this.from === null ? this.#targetComponent.get(this.property) : this.from,
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
    if (this.endEvent) {
      this.entity.emit(this.endEvent, {timeOverrun});
    }
    if (this.multipleStart) {
      this.#removeOnce = this.entity.once(this.startEvent, evt => {
        this.createTween(evt?.timeOverrun);
      });
    }
  }

  animate(progress) {
    this.#targetComponent.update({[this.property]: progress});
  }

  remove() {
    tweens.delete(this.#tween);
    this.#removeOnce();
  }

}
import Component from '../Component.js';
import mainloop from '../systems/MainLoop.js';

export default class Position extends Component {

  init({x, y}) {
    this.x = x;
    this.y = y;
    //register to the mainloop system
    this.tick = this.tick.bind(this);
    mainloop.register(this.tick);
  }

  remove() {
    mainloop.unregister(this.tick);
  }

  tick(dt, t) {
    this.entity.emit('test-event');
  }

}
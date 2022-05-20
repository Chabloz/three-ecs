import Component from '../Component.js';

export default class Rotation extends Component {

  init({r}) {
    this.r = r;
    this.removeListener = this.entity.addListener('test-event', () => {
      console.log(this.r)
      this.entity.removeComponent(this);
    })
  }

  remove() {
    this.removeListener();
  }

}
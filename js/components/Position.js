import Component from './Component.js';

export default class Position extends Component {

  init({x = null, y = null, z = null} = {}) {
    this.update({x, y, z});
  }

  update({x = null, y = null, z = null} = {}) {
    const pos = this.entity.object3D.position;
    if (x != null) pos.x = x;
    if (y != null) pos.y = y;
    if (z != null) pos.z = z;
  }

  remove() {

  }

}
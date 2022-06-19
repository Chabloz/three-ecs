import Component from './Component.js';

export default class Rotation extends Component {

  init({x = null, y = null, z = null} = {}) {
    this.update({x, y, z});
  }

  update({
    x = null,
    y = null,
    z = null
  } = {}) {
    const rot = this.entity.object3D.rotation;
    if (x != null) rot.x = x;
    if (y != null) rot.y = y;
    if (z != null) rot.z = z;
  }

  get(property) {
    return this.entity.object3D.rotation[property];
  }

}
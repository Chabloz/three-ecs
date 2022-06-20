import Component from './Component.js';

export default class Visibility extends Component {

  init({
    visible = true,
  } = {}) {
    this.update({visible});
  }

  update({
    visible = null,
  } = {}) {
    if (visible != null) this.entity.object3D.visible = visible;
  }

  get(property) {
    if (property != 'visible') return undefined;
    return this.entity.object3D.visible;
  }

}
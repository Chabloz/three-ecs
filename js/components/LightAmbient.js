import Component from './Component.js';
import { AmbientLight }  from '../lib/three/build/three.module.js';

export default class LightAmbient extends Component {

  init({
    color = 0x404040
  } = {}) {
    const light = new AmbientLight(color);
    this.entity.setObject3D(light, this.id);
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}
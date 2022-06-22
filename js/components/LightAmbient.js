import Component from './Component.js';
import { AmbientLight, Color }  from '../lib/three/build/three.module.js';

export default class LightAmbient extends Component {
  #light

  init({
    color = 0x404040,
    intensity = 1,
  } = {}) {
    this.#light = new AmbientLight();
    this.update({color, intensity});
    this.entity.setObject3D(this.#light, this.id);
  }

  update({color = null, intensity = null} = {}) {
    if (intensity) {
      this.intensity = intensity;
      this.#light.intensity = this.intensity;
    }
    if (color) {
      this.color = color;
      this.#light.color = new Color(this.color);
    }
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}
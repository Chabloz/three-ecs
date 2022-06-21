import Component from './Component.js';
import raycaster from "../systems/Raycaster.js";

export default class Clickable extends Component {

  init() {
    raycaster.register(this.entity);
  }

  remove() {
    raycaster.unregister(this.entity);
  }

}
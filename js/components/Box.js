import Component from './Component.js';
import { BoxGeometry, Mesh, MeshPhysicalMaterial }  from '../lib/three/build/three.module.js';

export default class Box extends Component {

  init({}) {
    const geometry = new BoxGeometry();
    const material = new MeshPhysicalMaterial( { color: 0x00ff00 } );
    const box = new Mesh( geometry, material );

    this.entity.setObject3D(box, this.id);
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}

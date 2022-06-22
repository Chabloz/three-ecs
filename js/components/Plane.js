import Component from './Component.js';
import { PlaneGeometry, Mesh, MeshPhysicalMaterial, DoubleSide }  from '../lib/three/build/three.module.js';

export default class Plane extends Component {

  init({}) {
    const geometry = new PlaneGeometry(2, 2);
    const material = new MeshPhysicalMaterial( { color: 0x00ff00, side: DoubleSide } );
    const plane = new Mesh( geometry, material );
    this.entity.setObject3D(plane, this.id);
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}

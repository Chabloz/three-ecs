import Component from './Component.js';
import * as THREE from '../lib/three/build/three.module.js';

export default class Box extends Component {

  init({}) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const box = new THREE.Mesh( geometry, material );
    this.entity.object3D = box;
  }

  remove() {
    this.entity.removeObject3D();
  }

}
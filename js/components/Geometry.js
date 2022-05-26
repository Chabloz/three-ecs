import Component from './Component.js';
import * as THREE from '../lib/three/build/three.module.js';

export default class Geometry extends Component {

  init({}) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    this.entity.object3D = cube;
  }

  remove() {

  }

}
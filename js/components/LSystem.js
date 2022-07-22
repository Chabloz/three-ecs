import Component from './Component.js';
import {
   MeshBasicMaterial,
   TorusGeometry,
   CircleGeometry,
   DoubleSide,
   InstancedMesh,
   Object3D,
   Color,
   Group,
}  from '../lib/three/build/three.module.js';

export default class LSystem extends Component {
  #current

  init({
    // L system axiom
    axiom = 'A',
    // L system rules
    rules = {
      A: 'B[+A][-A]BA',
      B: 'BB',
      C: 'B', //todo multiple rules for the same letter
    },
    // L system angle
    angle = 60,
  } = {}) {
    this.axiom = axiom;
    this.rules = rules;
    this.angle = angle;
    this.#current = this.axiom;
    console.log(this.axiom);
  }

  applyRule() {
    let newCurrent = '';
    for (const letter of this.#current) {
      newCurrent += this.rules[letter] ? this.rules[letter] : letter;
    }
    this.#current = newCurrent;
    console.log(this.#current);
  }

  update({

  }) {

  }

  remove() {
    this.entity.removeObject3D(this.id);
  }


}
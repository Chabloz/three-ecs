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


export default class HexagonTesselationAutomaton extends Component {

  init({
    radius = 4, // radius of the hexagonal tesselation. 1: 1 hexagon, 2: 1 + 6 hexagon around, 3: 1 + 6 + 12 around, 4: 1+6+12+18, ...
    tileSize = 1, // size of one of the hexagons
    borderSize = tileSize / 20, // border size of one of the hexagons
    colorsAlive = ['#FF9700', '#FF4700', '#BF1700', '#8F0700', '#5300FF', '#2900FF'], // colors of the alive hexagons
    colorDead = '#000000', // dead color
    borderColor = 'black', // border color
    probAlive = 0.8,
    birthRule = [3, 4, 5, 6],
    survivalRule = [5, 6],
    nbLifes = 1,
  } = {}) {
    this.radius = radius;
    this.tileSize = tileSize;
    this.borderSize = borderSize;
    this.colorsAlive = colorsAlive;
    this.borderColor = borderColor;
    this.colorDead = colorDead;
    this.probAlive = probAlive;
    this.birthRule = new Set(birthRule);
    this.survivalRule = new Set(survivalRule);
    this.nbLifes = nbLifes;
    this.size = this.radius - 1;

    this.#genColor();
    this.#genTesselation();
    this.#genBorderMesh();
    this.#genHexagonMesh();
    this.#genMeshTessalation();
  }

  update({
    tesselation = null,
    birthRule = null,
    survivalRule = null,
  }) {
    if (tesselation) this.updateTesselation(tesselation);
    if (birthRule) this.birthRule = new Set(birthRule);
    if (survivalRule) this.survivalRule = new Set(survivalRule);
  }

  updateTesselation(tesselation) {
    let indInstance = 0;
    for (let q = -this.size; q <= this.size; q++) {
      for (let r = Math.max(-this.size, -q - this.size); r <= Math.min(this.size, -q + this.size); r++) {
        const aliveState = this.tesselation.get(q).get(r).alive;
        this.hexagonMesh.setColorAt(indInstance++, aliveState ? this.alivesColorArray[aliveState - 1] :  this.deadColor);
      }
    }
    this.hexagonMesh.instanceColor.needsUpdate = true;
  }

  applyRule() {
    const toSwitchRegen = [];
    const toSwitchDead = [];

    for (let q = -this.size; q <= this.size; q++) {
      for (let r = Math.max(-this.size, -q - this.size); r <= Math.min(this.size, -q + this.size); r++) {
        const hexagon = this.tesselation.get(q).get(r);
        const nbAliveNeighbors = this.#getNbAliveNeighbors(q, r);
        if (hexagon.alive == 0 && this.birthRule.has(nbAliveNeighbors)) {
          toSwitchRegen.push(hexagon);
        } else if (hexagon.alive > 0 && !this.survivalRule.has(nbAliveNeighbors)) {
          toSwitchDead.push(hexagon);
        } else if (hexagon.alive > 0 && hexagon.alive < this.nbLifes && this.birthRule.has(nbAliveNeighbors)) {
          toSwitchRegen.push(hexagon);
        }
      }
    }

    for (const hexagon of toSwitchRegen) {
      hexagon.alive += 1;
    }
    for (const hexagon of toSwitchDead) {
      hexagon.alive -= 1;
    }
    this.update({tesselation: this.tesselation});
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

  #genMeshTessalation() {
    const dummy = new Object3D();
    let indInstance = 0;
    for (let q = -this.size; q <= this.size; q++) {
      for (let r = Math.max(-this.size, -q - this.size); r <= Math.min(this.size, -q + this.size); r++) {
        const x = this.tileSize * (1.5 * q);
        const y = this.tileSize * (Math.sqrt(3) / 2 * q  +  Math.sqrt(3) * r);
        const aliveState = this.tesselation.get(q).get(r).alive;
        dummy.position.set(x, y, 0);
        dummy.updateMatrix();
        this.borderMesh.setMatrixAt(indInstance, dummy.matrix);
        this.hexagonMesh.setMatrixAt(indInstance, dummy.matrix);
        this.hexagonMesh.setColorAt(indInstance++, aliveState ? this.alivesColorArray[aliveState - 1] :  this.deadColor);
      }
    }

    const borderAndHexagon = new Group();
    borderAndHexagon.add(this.borderMesh);
    borderAndHexagon.add(this.hexagonMesh);
    this.entity.setObject3D(borderAndHexagon, this.id);
  }

  #genColor() {
    this.alivesColorArray = this.colorsAlive.map(color => new Color(color));
    this.deadColor = new Color(this.colorDead);
  }

  #genBorderMesh() {
    this.borderGeometry = new TorusGeometry(this.tileSize, this.borderSize, 2, 6);
    this.borderMaterial = new MeshBasicMaterial({color: new Color(this.borderColor)});
    this.borderMesh = new InstancedMesh(this.borderGeometry, this.borderMaterial, 1 + 3 * this.size * (this.size + 1));
  }

  #genHexagonMesh() {
    this.hexagonGeometry = new CircleGeometry(this.tileSize - this.borderSize, 6);
    this.hexagonMaterial = new MeshBasicMaterial({color: new Color(this.alivesColorArray[0])});
    this.hexagonMaterial.side = DoubleSide;
    this.hexagonMesh = new InstancedMesh(this.hexagonGeometry, this.hexagonMaterial, 1 + 3 * this.size * (this.size + 1));
  }



  #genTesselation() {
    this.tesselation = new Map();
    for (let q = -this.size; q <= this.size; q++) {
      this.tesselation.set(q, new Map());
      for (let r = Math.max(-this.size, -q - this.size); r <= Math.min(this.size, -q + this.size); r++) {
        this.tesselation.get(q).set(r, {
          q,
          r,
          alive: Math.random() < this.probAlive ?
            Math.floor(Math.random() * this.nbLifes) + 1
            : 0,
        });
      }
    }
  }

  #getNbAliveNeighbors(q, r) {
    const current = this.tesselation.get(q).get(r);
    let toCount = current.alive;
    const coords = [
      {q: 0, r: -1},
      {q: 0, r: +1},
      {q: +1, r: 0},
      {q: +1, r: -1},
      {q: -1, r: 0},
      {q: -1, r: +1},
    ];
    let cmptAlive = 0;
    if (toCount == 0) toCount++; //for dead cells, count all alive cells around
    for (const coord of coords) {
      const col = this.tesselation.get(q + coord.q);
      if (!col) continue;
      const neighbor = col.get(r + coord.r);
      if (neighbor && neighbor.alive >= toCount) cmptAlive++;
    }
    return cmptAlive;
  }

}
import Component from './Component.js';
import { Color, Group }  from '../lib/three/build/three.module.js';
import { MeshBasicMaterial, Mesh }  from '../lib/three/build/three.module.js';
import { TorusGeometry, CircleGeometry, DoubleSide }  from '../lib/three/build/three.module.js';



export default class HexagonTesselation extends Component {

  init({
    radius = 4, // radius of the hexagonal tesselation. 1: 1 hexagon, 2: 1 + 6 hexagon around, 3: 1 + 6 + 12 around, 4: 1+6+12+18, ...
    tileSize = 1, // size of one of the hexagons
    borderSize = tileSize / 20, // border size of one of the hexagons
    color = 'white', // inner color
    borderColor = 'red', // border color
  } = {}) {
    this.radius = radius;
    this.tileSize = tileSize;
    this.borderSize = borderSize;
    this.color = color;
    this.borderColor = borderColor;

    const innerGeometry = new CircleGeometry(this.tileSize - this.borderSize, 6);
    const innerMaterial = new MeshBasicMaterial({color: new Color(this.color)});
    innerMaterial.side = DoubleSide;
    const innerHexagon = new Mesh(innerGeometry, innerMaterial);

    const outerGeometry = new TorusGeometry(this.tileSize, this.borderSize, 2, 6);
    const outerMaterial = new MeshBasicMaterial({color: new Color(this.borderColor)});
    const hexagon = new Mesh(outerGeometry, outerMaterial);

    const tilemap = new Map();
    const tesselation = new Group();
    const size = radius - 1;
    for (let q = -size; q <= size; q++) {
      for (let r = Math.max(-size, -q - size); r <= Math.min(size, -q + size); r++) {
        const s = -q - r;
        const x = tileSize * (1.5 * q);
        const y = tileSize * (Math.sqrt(3) / 2 * q  +  Math.sqrt(3) * r);
        const innerMesh = innerHexagon.clone();
        const mesh = hexagon.clone();
        innerMesh.userData.coord = {q, r, s};
        mesh.userData.coord = {q, r, s};
        innerMesh.position.set(x, y, 0);
        mesh.position.set(x, y, 0);
        tilemap.set(`${q},${r}`, mesh);
        tesselation.add(innerMesh);
        tesselation.add(mesh);
      }
    }

    this.entity.setObject3D(tesselation, this.id);
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}
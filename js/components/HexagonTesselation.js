import Component from './Component.js';
import { Vector2, Shape, Color, BufferGeometry, Line, LineBasicMaterial, Group }  from '../lib/three/build/three.module.js';
import { ExtrudeGeometry, MeshBasicMaterial, Mesh}  from '../lib/three/build/three.module.js';
import { EdgesGeometry, LineSegments, TorusGeometry}  from '../lib/three/build/three.module.js';



export default class HexagonTesselation extends Component {

  init({
    radius = 4, // radius of the hexagonal tesselation. 1: 1 hexagon, 2: 1 + 6 hexagon around, 3: 1 + 6 + 12 around, 4: 1+6+12+18, ...
    tileSize = 0.5, // size of one of the hexagons
    ratioBorder = 0.1, // ratio of the border of the hexagon
    color = 'white', // base color material
  } = {}) {
    this.radius = radius;
    this.tileSize = tileSize;
    this.color = color;
    this.ratioBorder = ratioBorder;

    const geometry = new TorusGeometry(this.tileSize, this.tileSize * this.ratioBorder, 2, 6);
    const material = new MeshBasicMaterial({color: new Color(color)});
    const hexagon = new Mesh(geometry, material);

    const tilemap = new Map();
    const tesselation = new Group();
    const size = radius - 1;
    for (let q = -size; q <= size; q++) {
      for (let r = Math.max(-size, -q - size); r <= Math.min(size, -q + size); r++) {
        const s = -q - r;
        const x = tileSize * (1.5 * q);
        const y = tileSize * (Math.sqrt(3) / 2 * q  +  Math.sqrt(3) * r);
        const mesh = hexagon.clone();
        mesh.userData.coord = {q, r, s};
        mesh.position.set(x, y, 0);
        tilemap.set(`${q},${r}`, mesh);
        tesselation.add(mesh);
      }
    }

    this.entity.setObject3D(tesselation, this.id);
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}
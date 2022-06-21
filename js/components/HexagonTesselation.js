import Component from './Component.js';
import { Vector2, Shape, Color, BufferGeometry, Line, LineBasicMaterial, Group }  from '../lib/three/build/three.module.js';
import { ExtrudeGeometry, MeshBasicMaterial, Mesh}  from '../lib/three/build/three.module.js';
import { EdgesGeometry, LineSegments}  from '../lib/three/build/three.module.js';



export default class HexagonTesselation extends Component {

  init({
    radius = 4, // radius of the hexagonal tesselation. 1: 1 hexagon, 2: 1 + 6 hexagon around, 3: 1 + 6 + 12 around, 4: 1+6+12+18, ...
    tileSize = 0.5, // size of one of the hexagons
    color = 'black', // base color material
  } = {}) {
    this.radius = radius;
    this.tileSize = tileSize;
    this.color = color;

    const vertices = [];
    for (let i = 0; i < 6; i++ ) {
      const angle = 1.0471975511965976 * i; // (Math.PI / 180) * (60 * i - 30);
      const vertice = new Vector2(tileSize * Math.cos(angle), tileSize * Math.sin(angle));
      vertices.push(vertice);
    }

    const shape = new Shape();
    shape.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < 6; i++) {
      shape.lineTo(vertices[i].x, vertices[i].y);
    }
    shape.lineTo(vertices[0].x, vertices[0].y);


    // const material = new LineBasicMaterial({color: new Color(color)});
    // const points = shape.getPoints();
    // const geometry = new BufferGeometry().setFromPoints(points);
    // const hexagon = new Line(geometry, material);

    // const material = new LineBasicMaterial({color: new Color(color)});
    // const extrudeSettings = {steps: 1, depth: 1, bevelEnabled: false};
    // const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    // const edgesGeometry = new EdgesGeometry(geometry); // or WireframeGeometry( geometry )
    // const hexagon = new LineSegments(edgesGeometry, material);

    // Geometry: extrude the shape
    const extrudeSettings = {steps: 1, depth: 1, bevelEnabled: false};
    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
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
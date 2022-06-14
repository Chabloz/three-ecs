import Component from './Component.js';
import { Vector2, Shape, Color, BufferGeometry, Line, LineBasicMaterial, Group }  from '../lib/three/build/three.module.js';


export default class HexagonTesselation extends Component {

  init({
    radius = 4, // radius of the hexagonal tesselation. 1: 1 hexagon, 2: 1 + 6 hexagon around, 3: 1 + 6 + 12 around, 4: 1+6+12+18, ...
    tileSize = 0.5, // size of one of the hexagons
    color = 'black', // base color material
  } = {}) {

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

    const material = new LineBasicMaterial({color: new Color(color)});

    const points = shape.getPoints();
    const geometry = new BufferGeometry().setFromPoints(points);
    const hexagonLines = new Line(geometry, material);

    const tilemap = new Map();
    const tesselation = new Group();
    const size = radius - 1;
    for (let q = -size; q <= size; q++) {
      for (let r = Math.max(-size, -q - size); r <= Math.min(size, -q + size); r++) {
        const s = -q - r;
        const x = tileSize * (1.5 * q);
        const y = tileSize * (Math.sqrt(3) / 2 * q  +  Math.sqrt(3) * r);
        const mesh = hexagonLines.clone();
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



/*
import * as THREE from '../lib/three/build/three.module.js';

export default function ({

} = {}) {
  // Vertices: The 6 vertices of an hexagon


  // Shape: draw it from the vertices


  // Geometry: extrude the shape


  // Materials: Make a simple Material for each color variation


  // Hexagon mesh: put it all togethers


  // Tesselation : explanation here https://www.redblobgames.com/grids/hexagons/#coordinates-cube


  function distanceTo(q1, r1, q2, r2) {
    return (Math.abs(q1 - q2)
      + Math.abs(q1 + r1 - q2 - r2)
      + Math.abs(r1 - r2)) / 2;
  }

  function getNeighbors(q, r, chebyshevDist = 1, outerOnly = false) {
    const test = outerOnly ? d => d == chebyshevDist : d => d <= chebyshevDist
    const neighbors = [];
    for (const tile of tilemap.values()) {
      let {q: q2, r: r2} = tile.userData.coord;
      if (test(distanceTo(q, r, q2, r2))) {
        neighbors.push(tile);
      }
    }
    return neighbors;
    // todo return sorted by (0 -1, +1 -1, +1  0, 0 +1, -1 +1, -1  0) or for dist 2:  0 -2, +1 -2, +2 -2, +2 -1, +2  0, +1 +1, 0 +2, -1 +2, -2 +2, -2 +1, -2  0, -1 -1
  }

  return {tesselation, tilemap, getNeighbors, distanceTo, radius};
}*/
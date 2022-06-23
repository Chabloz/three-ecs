import Component from './Component.js';
import { PlaneGeometry, Mesh, MeshStandardMaterial, DoubleSide }  from '../lib/three/build/three.module.js';

export default class Plane extends Component {
  #geometry
  #plane

  init({
    width = 1,
    height = 1,
    color = 'white',
    widthSegments  = 1,
    heightSegments  = 1,
  } = {}) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;

    this.#geometry = new PlaneGeometry(this.width, this.height, this.widthSegments, this.heightSegments);
    const material = new MeshStandardMaterial({ color: 0x00ff00, side: DoubleSide });
    this.#plane = new Mesh(this.#geometry, material);
    this.entity.setObject3D(this.#plane, this.id);
  }

  update({
    width = null,
    height = null,
    color = null,
    widthSegments  = null,
    heightSegments  = null,
  } = {}) {
    // todo put that in a helper function
    if (Object.keys(arguments[0]).length == 0) return

    if (width) this.width = width;
    if (height) this.height = height;
    if (color) this.color = color;
    if (widthSegments) this.widthSegments = widthSegments;
    if (heightSegments) this.heightSegments = heightSegments;

    this.#geometry.dispose();
    this.#geometry = new PlaneGeometry(this.width, this.height, this.depth, this.widthSegments, this.heightSegments, this.depthSegments);
    this.#plane.geometry = this.#geometry;
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}

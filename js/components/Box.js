import Component from './Component.js';
import { BoxGeometry, Mesh, MeshStandardMaterial, Color }  from '../lib/three/build/three.module.js';

export default class Box extends Component {
  #geometry
  #box

  init({
    width = 1,
    height = 1,
    depth = 1,
    color = 'white',
    widthSegments  = 1,
    heightSegments  = 1,
    depthSegments  = 1,
  }) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    this.depthSegments = depthSegments;

    this.#geometry = new BoxGeometry(this.width, this.height, this.depth, this.widthSegments, this.heightSegments, this.depthSegments);
    const material = new MeshStandardMaterial({ color: new Color(this.color) });
    this.#box = new Mesh(this.#geometry, material);

    this.entity.setObject3D(this.#box, this.id);
  }

  update({
    width = null,
    height = null,
    depth = null,
    color = null,
    widthSegments  = null,
    heightSegments  = null,
    depthSegments  = null,
  } = {}) {
    // todo put that in a helper function
    if (Object.keys(arguments[0]).length == 0) return

    if (width) this.width = width;
    if (height) this.height = height;
    if (depth) this.depth = depth;
    if (color) this.color = color;
    if (widthSegments) this.widthSegments = widthSegments;
    if (heightSegments) this.heightSegments = heightSegments;
    if (depthSegments) this.depthSegments = depthSegments;

    this.#geometry.dispose();
    this.#geometry = new BoxGeometry(this.width, this.height, this.depth, this.widthSegments, this.heightSegments, this.depthSegments);
    this.#box.geometry = this.#geometry;
  }

  remove() {
    this.entity.removeObject3D(this.id);
  }

}

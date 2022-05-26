import World from './World.js';
import Entity from './entities/Entity.js';
import ThreeEntity from './entities/ThreeEntity.js';
import Position from './components/Position.js';
import Rotation from './components/Rotation.js';
import Geometry from './components/Geometry.js';
import LookAt from './components/LookAt.js';

import * as THREE from './lib/three/build/three.module.js';

import mainloop from './systems/MainLoop.js';

const world = new World();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const cube1 = new ThreeEntity({parent: scene});
cube1.addComponent(Geometry);
cube1.addComponent(Rotation, {x:2 , z: 2});
cube1.addComponent(Position, {x:2 , z: 2});
cube1.addComponent(LookAt, {target: camera});

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

function render() {
  renderer.render( scene, camera );
}

mainloop.registerRender(render);
mainloop.start();



// mainloop.start();

// const e1 = new Entity();
// const c1 = e1.addComponent(Position, { x: 1, y: 1 });
// const c2 = e1.addComponent(Position, { x: 2, y: 2 });
// const c3 = e1.addComponent(Rotation, { r: 3 });
// world.add(e1);

// const e2 = new Entity();
// e2.addComponent(Position, { x: 3, y: 3 });
// e2.addComponent(Rotation, { r: 4 });
// world.add(e2);

// console.log(e2);

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );


// const e3 = new ThreeEntity('my-box', scene);
// e3.addComponent(Geometry, {});
// e3.addComponent(LookAt, {target: camera});

// world.add(e3);
// setTimeout(() => {
//   world.remove(e3);
// }, 2000);


// const cube = new THREE.Mesh( geometry, material );
// const cube2 = new THREE.Mesh( new THREE.BoxGeometry(), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
// scene.add( cube );
// scene.add( cube2 );

// camera.position.z = 5;

// function animate() {
//   requestAnimationFrame( animate );

//   renderer.render( scene, camera );
// };

// animate();


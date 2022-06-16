import World from './worlds/ThreeWorld.js';
import Position from './components/Position.js';
import Rotation from './components/Rotation.js';
import HexagonTesselation from './components/HexagonTesselation.js';
import LightAmbient from './components/LightAmbient.js';
import Box from './components/Box.js';
import Camera from './components/Camera.js';
import LookAt from './components/LookAt.js';
import ListenTo from './components/ListenTo.js';

const world = new World();

const e0 = world.create(
  Box,
  [Rotation, {x:2 , z: 2}],
  [Position, {x:-2 , z: -4}]
);

const e1 = world.create(
  [HexagonTesselation, {radius: 10}], // maybe make this object ?
  Box,
  [Rotation, {x:2 , z: 2}],
  [Position, {x:0 , z: -4}],
  [ListenTo, {targetEntity: e0}]
);
e1.addListener('click', () => console.log('e0 was clicked so me tooo'));

const camera = world.create(
  [Camera, {active: false}],
  [Position, {z: 8}],
);

setTimeout(() => {
  e0.emit('click');
  e1.addComponent(LookAt, {target: camera});
}, 1000);

setTimeout(() => {
  e1.removeComponent(Box);
}, 2000);

setTimeout(() => {
  camera.updateComponent(Camera, {active: true});
}, 3000);

// e1.addComponent(LookAt, {target: e0});

world.start();
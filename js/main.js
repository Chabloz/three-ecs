import World from './worlds/ThreeWorld.js';
import Position from './components/Position.js';
import Rotation from './components/Rotation.js';
import HexagonTesselation from './components/HexagonTesselation.js';
import LightAmbient from './components/LightAmbient.js';
import Box from './components/Box.js';
import Camera from './components/Camera.js';
import LookAt from './components/LookAt.js';
import ListenTo from './components/ListenTo.js';
import Animation from './components/Animation.js';

const world = new World();

const e0 = world.createEntity({
  id: 'the-box',
  components: [
    Box,
    [Rotation, {x:2 , z: 2}],
    [Position, {x:-2 , z: -4}],
    [Animation, {
      component: Rotation,
      property: 'y',
      to: Math.PI,
      startEvent: 'rotate',
      duration: 1500,
      yoyo: true,
      loop: true,
      ease: 'bounceOut',
    }],
  ]
});

const e1 = world.create(
  [HexagonTesselation, {radius: 10}], // maybe make this object ?
  [Rotation, {x:2 , z: 2}],
  [Position, {x:0 , y: 2, z: -4}],
  [ListenTo, {target: world.get('the-box')}],
  [Animation, {
    component: Position,
    property: 'y',
    to: 0,
    startEvent: 'click',
    duration: 1000,
    endEvent: 'rotate',
    ease: 'bounceOut',
  }],
  [Animation, {
    component: Rotation,
    property: 'y',
    to: Math.PI,
    startEvent: 'rotate',
    endEvent: 'finish',
    duration: 1500,
    yoyo: true,
    ease: 'bounceOut',
  }],
);

e0.addComponent(ListenTo, {
  target: e1,
  event: 'finish',
  eventOnSelf: 'rotate',
});

e1.addListener('click', () => console.log('e0 was clicked so me tooo'));
console.log(e1.getComponent(ListenTo).get('target'));

const camera = world.create(
  [Camera, {active: false}],
  [Position, {z: 8}],
);

setTimeout(() => {
  e0.emit('click');
  // e0.addComponent(LookAt, {target: camera});
}, 1000);

setTimeout(() => {
  e0.emit('click');
  console.log(e0.getComponent(Animation).get('tween'));
}, 2000);

// setTimeout(() => {
//   camera.updateComponent(Camera, {active: true});
//   world.remove('the-box');
//   console.log(world.has(e1));
// }, 3000);

// e1.addComponent(LookAt, {target: e0});

world.start();
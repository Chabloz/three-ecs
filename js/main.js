import World from './worlds/ThreeWorld.js';
import Position from './components/Position.js';
import Rotation from './components/Rotation.js';
import Box from './components/Box.js';
import Plane from './components/Plane.js';
import Camera from './components/Camera.js';
import LookAt from './components/LookAt.js';
import Animation from './components/Animation.js';
import Clickable from './components/Clickable.js';
import MaterialLifeLikeAutomaton from './components/MaterialLifeLikeAutomaton.js';

const world = new World({backgroundColor: 'black'});

const camera = world.create(Camera, [Position, {z: 4, y: 1}]);

const parent = world.create(
  [Position, {z: -4}],
  Rotation,
  Clickable,
  [Animation, {
    component: Rotation,
    property: 'y',
    to: Math.PI,
    duration: 1500,
    ease: 'bounceOut',
    startEvent: 'click'
  }],
);

const b1 = world.createEntity({
  parent: parent,
  components: [
    Box,
    Clickable,
    [Rotation, {x: 2, y: 2}],
    [Position, {x: -1, y: 0, z: -4}],
    [Animation, {
      component: Position,
      property: 'y',
      to: 2,
      duration: 1500,
      yoyo: true,
      startEvent: 'click',
      ease: 'bounceOut',
      multipleStart: true,
    }],
  ]
});

const b2 = world.createEntity({
  parent: parent,
  components: [
    [Box, {}, 'the-box'],
    [Plane, {height: 2, width: 2}, 'the-plane'],
    Clickable,
    [Rotation, {x: -2, y: 2}],
    [Position, {x: 1, z: -4}],
    [Animation, {
      component: Position,
      property: 'y',
      to: 2,
      duration: 1500,
      yoyo: true,
      startEvent: 'click',
      ease: 'bounceOut',
      multipleStart: true,
    }],
    [LookAt, {target: b1}],
  ]
});

//

parent.addComponent(MaterialLifeLikeAutomaton);

world.start();

// const lights = world.create(
//   [LightAmbient, {intensity: 2}],
//   [LightDirectional, {intensity: 0.5}],
//   [Position, {x: 0, y: 5, z: 0}],
//   [Animation, {
//     component: LightDirectional,
//     property: 'intensity',
//     to: 5,
//     duration: 3000,
//     yoyo: true,
//     loop: true,
//   }],
//   [Animation, {
//     component: LightAmbient,
//     property: 'intensity',
//     to: 1,
//     duration: 3000,
//     yoyo: true,
//     loop: true,
//   }],
//   [ListenTo, {target: b2}],
//   [EventSet, {
//     component: Position,
//     property: 'y',
//     value: () => {
//       const pos = lights.getComponent(Position);
//       pos.update({y: -pos.get('y')});
//     },
//     multipleSet: true,
//   }],
// );
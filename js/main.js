import World from './worlds/ThreeWorld.js';
import Position from './components/Position.js';
import Rotation from './components/Rotation.js';
import HexagonTesselation from './components/HexagonTesselation.js';
import LightAmbient from './components/LightAmbient.js';
import LightDirectional from './components/LightDirectional.js';
import Box from './components/Box.js';
import Plane from './components/Plane.js';
import Camera from './components/Camera.js';
import LookAt from './components/LookAt.js';
import ListenTo from './components/ListenTo.js';
import Animation from './components/Animation.js';
import Visibility from './components/Visibility.js';
import EventSet from './components/EventSet.js';
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
    startEvent: 'click',
    endEvent: 'rotate',
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
  ]
});

const lights = world.create(
  [LightAmbient, {intensity: 2}],
  [LightDirectional, {intensity: 0.5}],
  [Position, {x: 0, y: 5, z: 0}],
  [Animation, {
    component: LightDirectional,
    property: 'intensity',
    to: 5,
    duration: 3000,
    yoyo: true,
    loop: true,
  }],
  [Animation, {
    component: LightAmbient,
    property: 'intensity',
    to: 1,
    duration: 3000,
    yoyo: true,
    loop: true,
  }],
  [ListenTo, {target: b2}],
  [EventSet, {
    component: Position,
    property: 'y',
    value: () => {
      const pos = lights.getComponent(Position);
      pos.update({y: -pos.get('y')});
    },
    multipleSet: true,
  }],
);

parent.addComponent(MaterialLifeLikeAutomaton);

parent.on('click', (evt) => console.log('p clicked', evt));
b1.on('click', (evt) => console.log('b1 clicked',evt));
b2.on('click', (evt) => console.log('b2 clicked',evt));
world.start();

// const e0 = world.createEntity({
//   id: 'the-box',
//   components: [
//     Box,
//     Clickable,
//     [Rotation, {x:2 , z: 2}],
//     [Position, {x:-2 , z: -4}],
//     [Visibility, {visible: false}],
//     [EventSet, {
//       component: Visibility,
//       property: 'visible',
//       value: true,
//       event: 'rotate',
//     }],
//     [Animation, {
//       component: Rotation,
//       property: 'y',
//       to: Math.PI,
//       startEvent: 'rotate',
//       duration: 1500,
//       yoyo: true,
//       loop: true,
//       ease: 'bounceOut',
//     }],
//   ]
// });
// e0.on('click', (event) => console.log('e0 was clicked', event));

// const e1 = world.create(
//   [HexagonTesselation, {radius: 10}],
//   Clickable,
//   [Rotation, {x:2 , z: 2}],
//   [Position, {x:0 , y: 2, z: -4}],
//   [ListenTo, {target: world.get('the-box')}],
//   [Animation, {
//     component: Position,
//     property: 'y',
//     to: 0,
//     startEvent: 'click',
//     duration: 1000,
//     endEvent: 'rotate',
//     ease: 'bounceOut',
//   }],
//   [Animation, {
//     component: Rotation,
//     property: 'y',
//     to: Math.PI,
//     startEvent: 'rotate',
//     endEvent: 'finish',
//     duration: 1500,
//     yoyo: true,
//     ease: 'bounceOut',
//   }],
// );
// e1.on('click', (event) => console.log('e1 was clicked', event));

// e0.addComponent(ListenTo, {
//   target: e1,
//   event: 'finish',
//   eventOnSelf: 'rotate',
// });

// const camera = world.create(
//   [Camera, {active: false}],
//   [Position, {z: 8}],
// );

// setTimeout(() => {
//   e0.emit('click');
//   // e0.addComponent(LookAt, {target: camera});
// }, 1000);

// // setTimeout(() => {
// //   e0.emit('click');
// // }, 2000);

// // setTimeout(() => {
// //   camera.updateComponent(Camera, {active: true});
// //   world.remove('the-box');
// //   console.log(world.has(e1));
// // }, 3000);

// // e1.addComponent(LookAt, {target: e0});

// world.start();
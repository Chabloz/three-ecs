import World from './worlds/ThreeWorld.js';
import Position from './components/Position.js';
import Camera from './components/Camera.js';
import OrbitControls from './components/OrbitControls.js';
import Clickable from './components/Clickable.js';
import HexagonTesselationAutomaton from './components/HexagonTesselationAutomaton.js';

import tweens from './systems/Tween.js';

const world = new World({backgroundColor: 'black'});

const camera = world.create(
  Camera,
  [Position, {z: 300}],
  [OrbitControls, {autoRotate: false}],
);

const automatonOpts = [
  {
    name: 'lavaShard',
    probAlive: 0.65,
    birthRule: [5, 6],
    survivalRule: [2, 4, 5, 6],
    borderSize: 0,
    nbLifes: 6,
  }, {
    name: 'minecraft',
    probAlive: 0.45,
    birthRule: [4, 5, 6],
    survivalRule: [3, 4, 5, 6],
  }, {
    name: 'ants',
    probAlive: 0.65,
    birthRule: [4, 5],
    survivalRule: [3, 4, 5],
  }, {
    name: 'combustion',
    probAlive: 0.9,
    birthRule: [2],
    survivalRule: [4, 5, 6],
  }, {
    name: 'veins',
    probAlive: 0.33,
    birthRule: [0, 4],
    survivalRule: [3, 4, 5, 6],
    borderSize: 0,
  }, {
    name: 'eaters',
    probAlive: 0.93,
    birthRule: [0, 4],
    survivalRule: [4, 5, 6],
    borderSize: 0,
    nbLifes: 1,
  }, {
    name: 'fireworks',
    probAlive: 0.9,
    birthRule: [2, 5],
    survivalRule: [3, 4, 6],
    borderSize: 0,
    nbLifes: 3,
  }, {
    name: 'fire',
    probAlive: 0.58,
    birthRule: [4, 6],
    survivalRule: [2, 4, 5, 6],
    borderSize: 0,
    nbLifes: 6,
  }, {
    name: 'lavaCrystal',
    probAlive: 0.25,
    birthRule: [3, 5, 6],
    survivalRule: [3, 4, 5, 6],
    borderSize: 0,
    nbLifes: 6,
  }, {
    name: 'clusters',
    probAlive: 0.65,
    birthRule: [4, 5],
    survivalRule: [3, 4, 5, 6],
    borderSize: 0,
    nbLifes: 6,
  }, {
    name: 'maze',
    probAlive: 0.85,
    birthRule: [3, 4, 5, 6],
    survivalRule: [5, 6],
    borderSize: 0,
    applyTwice: true,
  }
];

let hexagons = null;
let currentAutomaton = -1;
let anim = null;

function generateHexalife() {

  const options = automatonOpts[currentAutomaton++%automatonOpts.length];
  if (hexagons) world.remove(hexagons);
  hexagons = world.create(
    [HexagonTesselationAutomaton, {radius: 90, ...options}],
    Clickable,
  );
  hexagons.on('click', () => generateHexalife());
  if (anim) tweens.delete(anim);
  anim = tweens.create({
    duration: 1000/30,
    loop: true,
    animate : progress => {
      if (progress != 1) return
      hexagons.getComponent(HexagonTesselationAutomaton).applyRule();
      if (options.applyTwice) {
        hexagons.getComponent(HexagonTesselationAutomaton).applyRule()
      }
    },
  });
}
document.querySelector('svg').addEventListener('click', () => {
  generateHexalife();
  document.querySelector('.synn-modal').classList.add('hidden');
});

hexagons = world.create(
  [HexagonTesselationAutomaton, {radius: 80, ...automatonOpts[automatonOpts.length-1]}],
  Clickable,
);
for (let i = 0; i < 20; i++) {
  hexagons.getComponent(HexagonTesselationAutomaton).applyRule();
}

world.start();
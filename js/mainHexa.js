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
  [Position, {z: 400}],
  [OrbitControls, {autoRotate: false}],
);

const flowers = {
  probAlive: 0.85,
  birthRule: [3, 4, 5],
  survivalRule: [4, 5],
};

const maze = {
  probAlive: 0.85,
  birthRule: [3, 4, 5, 6],
  survivalRule: [5, 6],
  borderSize: 0,
};

const miro = {
  probAlive: 0.65,
  birthRule: [4, 5, 6],
  survivalRule: [4, 5, 6],
};

const minecraft = {
  probAlive: 0.45,
  birthRule: [4, 5, 6],
  survivalRule: [3, 4, 5, 6],
};

const antsTunnels = {
  probAlive: 0.65,
  birthRule: [4, 5],
  survivalRule: [3, 4, 5],
  nbLifes: 1,
};

const combustion = {
  probAlive: 0.9,
  birthRule: [2],
  survivalRule: [4, 5, 6],
  nbLifes: 1,
};

const veins = {
  probAlive: 0.33,
  birthRule: [0, 4],
  survivalRule: [3, 4, 5, 6],
  borderSize: 0,
  nbLifes: 1,
};

const eating = {
  probAlive: 0.93,
  birthRule: [0, 4],
  survivalRule: [4, 5, 6],
  borderSize: 0,
  nbLifes: 1,
};

const fireworks = {
  probAlive: 0.9,
  birthRule: [2, 5],
  survivalRule: [3, 4, 6],
  borderSize: 0,
  nbLifes: 3,
};

const fire = {
  probAlive: 0.58,
  birthRule: [4, 6],
  survivalRule: [2, 4, 5, 6],
  borderSize: 0,
  nbLifes: 6,
};

const lavaCrystal = {
  probAlive: 0.25,
  birthRule: [3, 5, 6],
  survivalRule: [3, 4, 5, 6],
  borderSize: 0,
  nbLifes: 6,
};

const lavaShard = {
  probAlive: 0.65,
  birthRule: [5, 6],
  survivalRule: [2, 4, 5, 6],
  borderSize: 0,
  nbLifes: 6,
};

const clusters = {
  probAlive: 0.65,
  birthRule: [4, 5],
  survivalRule: [3, 4, 5, 6],
  borderSize: 0,
  nbLifes: 6,
};

const options = maze;

const hexagons = world.create(
  [HexagonTesselationAutomaton, {
    radius: 100,
    ...options,
  }],
  Clickable,
);

const anim = tweens.create({
  duration: 1000/60,
  loop: true,
  animate : progress => {
    if (progress != 1) return
    hexagons.getComponent(HexagonTesselationAutomaton).applyRule()
  },
});

hexagons.on('click', () => tweens.delete(anim));

world.start();
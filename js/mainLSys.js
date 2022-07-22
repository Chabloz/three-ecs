import World from './worlds/ThreeWorld.js';
import Position from './components/Position.js';
import Camera from './components/Camera.js';
import OrbitControls from './components/OrbitControls.js';
import Clickable from './components/Clickable.js';
import HexagonTesselationAutomaton from './components/HexagonTesselationAutomaton.js';
import LSystem from './components/LSystem.js';

import tweens from './systems/Tween.js';


const world = new World({backgroundColor: 'black'});

world.create(Camera, [Position, {z: 300}], OrbitControls);

const l = world.create(
  LSystem,
);
const lSystem = l.getComponent(LSystem);
lSystem.applyRule();
lSystem.applyRule();
lSystem.applyRule();
lSystem.applyRule();
lSystem.applyRule();
world.start();
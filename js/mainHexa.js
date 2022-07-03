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
import OrbitControls from './components/OrbitControls.js';
import HexagonTesselation from './components/HexagonTesselation.js';
import LightAmbient from './components/LightAmbient.js';

const world = new World({backgroundColor: 'black'});

const camera = world.create(
  Camera,
  [Position, {z: 4}],
  OrbitControls
);

world.create(
  HexagonTesselation
);

world.start();
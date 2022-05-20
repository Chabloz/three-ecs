import World from './World.js';
import Entity from './Entity.js';
import Position from './components/Position.js';
import Rotation from './components/Rotation.js';

import mainloop from './systems/MainLoop.js';

const world = new World();

mainloop.start();

const e1 = new Entity();
const c1 = e1.addComponent(Position, { x: 1, y: 1 });
const c2 = e1.addComponent(Position, { x: 2, y: 2 });
const c3 = e1.addComponent(Rotation, { r: 3 });
world.add(e1);

const e2 = new Entity();
e2.addComponent(Position, { x: 3, y: 3 });
e2.addComponent(Rotation, { r: 4 });
world.add(e2);

console.log(e2);

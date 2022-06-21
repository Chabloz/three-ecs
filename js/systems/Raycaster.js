import mouse from "./Mouse.js";
import { Raycaster } from '../lib/three/build/three.module.js';

const raycaster = new Raycaster();
const registred = new Set();

document.addEventListener('click', evt => {
  if (registred.size < 1) return;

  let entityIterator = registred.values();
  let entity = entityIterator.next().value;
  const worldCamera = entity.world.getCamera();
  raycaster.setFromCamera(mouse.position, worldCamera);

  let minDistance = Infinity;
  let minDistanceEntities = new Map();
  while (entity) {
    const intersects = raycaster.intersectObjects(entity.objects3D, true);
    if (intersects.length > 0) {
      const distance = intersects[0].distance;
      if (distance < minDistance) minDistanceEntities.clear();
      if (distance <= minDistance) {
        minDistanceEntities.set(entity, intersects[0]);
        minDistance = distance;
      }
    }
    entity = entityIterator.next().value;
  }

  for (const [entity, intersection] of minDistanceEntities) {
    entity.emit('click', {intersection});
  }
});

export default {

  register(entity) {
    registred.add(entity);
  },

  unregister(entity) {
    registred.delete(entity);
  }

}
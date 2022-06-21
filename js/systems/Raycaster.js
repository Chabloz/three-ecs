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

  while (entity) {
    const intersects = raycaster.intersectObjects(entity.objects3D, true);
    if (intersects.length > 0) {
      entity.emit('click', {intersection: intersects[0]});
      return;
    }
    entity = entityIterator.next().value;
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
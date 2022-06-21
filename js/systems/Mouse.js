const mouse = {
  position: {
    x: 0,
    y: 0,
  }
};

document.addEventListener('mousemove', evt => {
  mouse.position.x = (evt.clientX / window.innerWidth) * 2 - 1;
  mouse.position.y = - (evt.clientY / window.innerHeight) * 2 + 1;
});

export default mouse;
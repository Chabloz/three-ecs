export default class MainLoop {

  constructor({
    updatePerSec = 60,
    autopause = true,
    panic = null
  } = {}) {
    this.updatePerSec = updatePerSec;
    this.panic = panic ?? this.resetFrameDelta;
    this.elapsedTime = 0;
    this.timestep = 1000 / this.updatePerSec;

    // Those var are only relevant inside of _tick(), but a reference is held externally
    // so that those variable are not garbage collected
    this.loop = null;
    this.callback = null;
    this.deltaTime = 0;
    this.frameDelta = 0;
    this.numUpdate = 0;

    this.registredUpdate = new Set();
    this.registredRender = new Set();
    // todo resgisterRenderInterpolated

    if (autopause) this.addListenerAutoPause();
  }

  addListenerAutoPause() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isRunning()) {
        this.stop();
      } else if (!document.hidden && !this.isRunning()) {
        this.start();
      }
    });
  }

  registerUpdate(callback) {
    this.registredUpdate.add(callback);
    return () => this.unregisterUpdate(callback);
  }

  unregisterUpdate(callback) {
    return this.registredUpdate.delete(callback);
  }

  registerRender(callback) {
    this.registredRender.add(callback);
    return () => this.unregisterRender(callback);
  }

  unregisterRender(callback) {
    return this.registredRender.delete(callback);
  }

  start() {
    this.loop = requestAnimationFrame(now => {
      this.lastTickTime = now;
      this._tick(now);
    });
  }

  stop() {
    cancelAnimationFrame(this.loop);
    this.loop = null;
  }

  toggle() {
    this.isRunning() ? this.stop() : this.start();
  }

  isRunning() {
    return this.loop != null;
  }

  resetFrameDelta() {
    this.frameDelta = 0;
  }

  get time() {
    return this.elapsedTime;
  }

  _tick(now) {
    this.loop = requestAnimationFrame(now => this._tick(now));
    this.deltaTime = now - this.lastTickTime;
    this.frameDelta += this.deltaTime;
    this.lastTickTime = now;

    // Fixed simulation steps
    this.numUpdate = 0;
    while (this.frameDelta >= this.timestep && this.numUpdate <= this.updatePerSec) {
      this.elapsedTime += this.timestep;

      for (this.callback of this.registredUpdate) {
        this.callback(this.timestep, this.elapsedTime);
      }
      this.frameDelta -= this.timestep;
      this.numUpdate++;
    }

    // We run the update loop for more than 1 second !
    if (this.numUpdate > this.updatePerSec) {
      this.panic(this.frameDelta); // by default this will reset the frameDelta
    }

    // call all registred render callback (only if atleast one update has been made)
    if (this.numUpdate > 0) {
      for (this.callback of this.registredRender) {
        this.callback();
      }
    }
  }

}
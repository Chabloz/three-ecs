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

    this.registred = new Set();

    if (autopause) this._addListenerAutoPause();
  }

  _addListenerAutoPause() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isRunning()) {
        this.stop();
      } else if (!document.hidden && !this.isRunning()) {
        this.start();
      }
    });
  }

  register(callback) {
    return this.registred.add(callback);
  }

  unregister(callback) {
    return this.registred.delete(callback);
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
    // todo save diff elaspedtime et now pour repartir de cette valeur précise
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
      for (this.callback of this.registred) {
        this.callback(this.timestep, this.elapsedTime);
      }
      this.frameDelta -= this.timestep;
      this.numUpdate++;
    }

    // We run the update loop for more than 1 second !
    if (this.numUpdate > this.updatePerSec) {
      this.panic(this.frameDelta); // by default this will reset the frameDelta
    }
  }

}
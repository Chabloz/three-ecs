import Tweens from "../utils/Tween.js";
import mainloop from "./MainLoop.js";

const tweens = new Tweens();

mainloop.register(dt => tweens.update(dt));

export default tweens;
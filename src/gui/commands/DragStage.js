import Loop from "../../utils/Loop";
import Signal from "../../utils/Signal";

import * as api from "../../api";
import * as maths from "../../maths";

export class DragStage{
  constructor(stage, mouse) {
    this.completed = new Signal();

    this.stage = stage;
    this.window = this.stage.window;
    this.mouse = mouse;

    this.mouseLastPos = new maths.Vector2();
    this.mouseBeginPos = new maths.Vector2();
    this.windowBeginPos = new maths.Vector2();

    this.friction = 0.9;
    this.vel = new maths.Vector2();

    this.moveLoop = new Loop(this.onMoveRelease, this, false);
  }

  startDrag() {
    this.moveLoop.pause();
    this.mouse.onMove.add(this.onDrag, this);

    this.mouseLastPos.copy(this.mouse.mouseInput);
    this.mouseBeginPos.copy(this.mouse.mouseInput);
    this.windowBeginPos.copy(this.window);

    this.mouse.mouseInput.setCursor("grabbing");
  }

  stopDrag() {
    this.mouse.onMove.remove(this.onDrag, this);
    this.mouse.mouseInput.setCursor("grab");
    this.moveLoop.play();
  }

  onDrag() {
    let tmp = maths.Vector2.create();
    let mouseDiff = tmp.copy(this.mouse.mouseInput)
        .sub(this.mouseBeginPos)
        .divide(this.stage.scale)
        .multiplyScalar(-1);
    let t = mouseDiff.add(this.windowBeginPos);
    this.window.x = t.x;
    this.window.y = t.y;
    this.vel.copy(this.mouse.mouseInput).sub(this.mouseLastPos);
    this.mouseLastPos.copy(this.mouse.mouseInput);
    tmp.dispose();
  }

  onMoveRelease(){
    this.vel.multiplyScalar(this.friction);

    let v = this.vel.clone()
        .divide(this.stage.scale)
        .multiplyScalar(-1);

    this.window.x += v.x;
    this.window.y += v.y;

    if(this.vel.getLength() < 0.01){
      this.moveLoop.pause();
    }
    v.dispose();
  }

  enable(){
    this.mouse.onDown.add(this.startDrag, this);
    this.mouse.onUp.add(this.stopDrag, this);
    this.mouse.mouseInput.setCursor("grab");
  }

  disable(){
    this.mouse.onDown.remove(this.startDrag, this);
    this.mouse.onUp.remove(this.stopDrag, this);
    this.mouse.onMove.remove(this.onDrag, this);
    this.mouse.mouseInput.setCursor("default");
    this.moveLoop.pause();
  }
}

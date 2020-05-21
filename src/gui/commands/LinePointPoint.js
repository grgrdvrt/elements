import Signal from "../../utils/Signal";
import {SelectOrCreatePoint} from "./SelectOrCreatePoint";
import * as api from "../../api";

export class LinePointPoint{
  constructor(stage, mouse){
    this.completed = new Signal();
    this.stage = stage;
    this.mouse = mouse;
  }

  enable(){
    this.p1Command = new SelectOrCreatePoint(this.stage, this.mouse);
    this.p1Command.enable();
    this.p1Command.completed.add(this.onP1, this);
    this.pointCommand = this.p1Command;
  }

  disable(){
    this.p1Command.completed.remove(this.onP1, this);
    if(this.p2Command){
      this.p2Command.completed.remove(this.onP2, this);
    }
    this.pointCommand.disable();
  }

  onP1(p1){
    this.p1 = p1;
    this.p2Temp = api.mouse(this.stage, this.mouse);
    this.line = api.line(this.p1, this.p2Temp);
    this.line.selectable = false;
    this.p1.selectable = false;
    this.p2Temp.selectable = false;
    this.stage.add(this.line);
    this.stage.add(this.p2Temp);

    this.p1Command.completed.remove(this.onP1, this);
    this.p1Command.disable();

    this.p2Command = new SelectOrCreatePoint(this.stage, this.mouse);
    this.p2Command.enable();
    this.p2Command.completed.add(this.onP2, this);
    this.pointCommand = this.p2Command;
  }

  onP2(p2){
    this.p2 = p2;


    this.p2Command.completed.remove(this.onP1, this);
    this.p2Command.disable();

    this.line.construction.src.p2 = this.p2;
    this.line.selectable = true;
    this.p1.selectable = true;
    this.p2.selectable = true;
    this.stage.remove(this.p2Temp);

    this.completed.dispatch(this.line);
  }

  cancel(){
    if(this.p1){
      this.p1Command.undo();
      this.stage.remove(this.line);
      this.p2Command.completed.remove(this.onP1, this);
      this.p2Command.disable();
    }
  }

  undo(){
    this.p1Command.undo();
    this.p2Command.undo();
    this.stage.remove(this.line);
  }

  redo(){
    this.p1Command.redo();
    this.p2Command.redo();
    this.stage.add(this.line);
  }
}

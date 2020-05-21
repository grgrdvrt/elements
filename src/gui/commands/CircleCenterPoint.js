import Signal from "../../utils/Signal";
import {SelectOrCreatePoint} from "./SelectOrCreatePoint";
import * as api from "../../api";

export class CircleCenterPoint{
  constructor(stage, mouse){
    this.completed = new Signal();
    this.stage = stage;
    this.mouse = mouse;
  }

  enable(){
    this.centerCommand = new SelectOrCreatePoint(this.stage, this.mouse);
    this.centerCommand.enable();
    this.centerCommand.completed.add(this.onCenter, this);
    this.pointCommand = this.centerCommand;
  }

  disable(){
    this.centerCommand.completed.remove(this.onCenter, this);
    if(this.pointCommand){
      this.pointCommand.completed.remove(this.onPoint, this);
    }
    this.pointCommand.disable();
  }

  onCenter(center){
    this.center = center;
    this.pointTemp = api.mouse(this.stage, this.mouse);
    this.circle = api.circle(this.center, this.pointTemp);
    this.circle.selectable = false;
    this.center.selectable = false;
    this.pointTemp.selectable = false;
    this.stage.add(this.circle);
    this.stage.add(this.pointTemp);

    this.centerCommand.completed.remove(this.onCenter, this);
    this.centerCommand.disable();

    this.pointCommand = new SelectOrCreatePoint(this.stage, this.mouse);
    this.pointCommand.enable();
    this.pointCommand.completed.add(this.onPoint, this);
    this.pointCommand = this.pointCommand;
  }

  onPoint(point){
    this.point = point;

    this.pointCommand.completed.remove(this.onCenter, this);
    this.pointCommand.disable();

    this.circle.construction.src.point = this.point;
    this.circle.selectable = true;
    this.center.selectable = true;
    this.point.selectable = true;
    this.stage.remove(this.pointTemp);

    this.completed.dispatch(this.circle);
  }

  cancel(){
    if(this.center){
      this.centerCommand.undo();
      this.stage.remove(this.circle);
      this.pointCommand.completed.remove(this.onCenter, this);
      this.pointCommand.disable();
    }
  }

  undo(){
    this.centerCommand.undo();
    this.pointCommand.undo();
    this.stage.remove(this.circle);
  }

  redo(){
    this.centerCommand.redo();
    this.pointCommand.redo();
    this.stage.add(this.line);
  }
}

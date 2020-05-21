import * as api from "../../api";
import * as maths from "../../maths";

import Signal from "../../utils/Signal";

export class DragPoint{
  constructor(stage, mouse){
    this.stage = stage;
    this.mouse = mouse;
    this.selectionCircle = new maths.Circle(undefined, 5);
    this.completed = new Signal();

    this.originalPos = new maths.Vector2();
    this.resultPos = new maths.Vector2();
    this.target = undefined;

  }

  enable(){
    this.mouse.onDown.add(this.onDown, this);
  }

  disable(){
    this.mouse.onDown.remove(this.onDown, this);
    this.mouse.onUp.remove(this.onUp, this);
    this.mouse.onMove.remove(this.onMove, this);
  }

  onDown(){
    this.selectionCircle.center.copy(this.mouse);
    this.selectionCircle.radius = 10 / Math.abs(this.stage.scale.x);

    let points = api.selectInCircle(this.stage.items, this.selectionCircle)
        .filter(item => {
          let isPoint = item.object.type === api.pointType;
          let isDraggable = item.construction !== api.defaultConstruction;
          return isPoint && isDraggable;
        });
    points.sort((a, b) => Math.abs(b.distance) - Math.abs(a.distance));
    if(points.length > 0){
      this.startDrag(points[0].object);
    }
  }

  startDrag(target){
    this.target = target;

    this.originalPos.copy(this.target.geom);
    this.mouse.onMove.add(this.onMove, this);
    this.mouse.onUp.add(this.onUp, this);
  }

  onUp(){
    this.resultPos.copy(this.target.geom);
    this.mouse.onMove.remove(this.onMove, this);
    this.mouse.onUp.remove(this.onUp, this);
    this.completed.dispatch();
  }

  onMove(){
    this.target.geom.copy(this.mouse);
  }

  cancel(){
  }

  undo(){
    this.target.geom.copy(this.originalPos);
  }

  redo(){
    this.target.geom.copy(this.resultPos);
  }
}

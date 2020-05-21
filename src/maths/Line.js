import * as maths from "./index";

export class Line{
  constructor(point = new maths.Vector2(), vector = new maths.Vector2()){
    this.point = point;
    this.vector = vector;
  }

  getYFromX(x){
    let t = (x - this.point.x) / this.vector.x;
    return this.point.y + t * this.vector.y;
  }

  getXFromY(y){
    let t = (y - this.point.y) / this.vector.y;
    return this.point.x + t * this.vector.x;
  }

  getPointAt(t, v = new maths.Vector2){
    return v.copy(this.vector)
      .multiplyScalar(t)
      .add(this.point);
  }
}

import * as maths from "./index";
export class Segment{
  constructor(p1 = new maths.Vector2(), p2 = new maths.Vector2()){
    this.p1 = p1;
    this.p2 = p2;
  }
}

import * as maths from "./index";

export function vectorsDistance(v1, v2){
  let dx = v2.x - v1.x;
  let dy = v2.y - v1.y;
  return Math.hypot(dx, dy);
}

export function vectorLineDistance(vector, line){
  let l2 = new maths.Line(vector, new maths.Vector2(-line.vector.y, line.vector.x));
  let p = maths.linesIntersection(line, l2);
  return vectorsDistance(vector, p);
}

export function vectorCircleDistance(v, c){
  return vectorsDistance(v, c.center) - c.radius;
}

export function circlesDistance(c1, c2){
  return vectorsDistance(c1.center, c2.center) - (c1.radius + c2.radius);
}

export function lineCircleDistance(l, c){
  return vectorLineDistance(c.center, l) - c.radius;
}

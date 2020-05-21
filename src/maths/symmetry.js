import * as maths from "./index";

export function pointAxialSymmetry(point, axis){
  let tmp = point.clone();
  pointCentralSymmetry(point, maths.projectVectorOnLine(tmp, axis));
  tmp.dispose();
  return point;
}

export function pointCentralSymmetry(point, center){
  point.x = 2 * center.x - point.x;
  point.y = 2 * center.y - point.y;
  return point;
}

export function circleAxialSymmetry(circle, axis){
  pointAxialSymmetry(circle.center, axis);
}

export function circleCentralSymmetry(circle, center){
  pointCentralSymmetry(circle.center, center);
}

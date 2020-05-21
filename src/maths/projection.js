import * as maths from "./index";

export function projectVectorOnCircle(vector, circle, result = new maths.Vector2()){
  result.copy(vector).sub(circle.center).setLength(circle.radius).add(circle.center);
  return result;
}

export function projectVectorOnLine(vector, line){
  let ab = line.vector.getLength();
  let ac = maths.vectorsDistance(line.point, vector);
  let bc = maths.vectorsDistance(line.point.clone().add(line.vector), vector);

  let ai = -(bc * bc - ab * ab - ac * ac) / (2 * ab);
  let result = line.vector.clone().setLength(ai).add(line.point);
  vector.copy(result);
  result.dispose();
  return vector;
}

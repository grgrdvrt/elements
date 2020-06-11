import * as maths from "./index";

export function projectPointOnCircle(point, circle, result = new maths.Vector2()){
    result.copy(point).sub(circle.center).setLength(circle.radius).add(circle.center);
    return result;
}

export function projectPointOnLine(point, line){
    const ab = line.vector.getLength();
    const ac = maths.pointsDistance(line.point, point);
    const bc = maths.pointsDistance(line.point.clone().add(line.vector), point);

    const ai = -(bc * bc - ab * ab - ac * ac) / (2 * ab);
    const result = line.vector.clone().setLength(ai).add(line.point);
    point.copy(result);
    result.dispose();
    return point;
}

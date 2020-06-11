import * as maths from "./index";

/** axial symmetry **/
export function pointAxialSymmetry(point, axis){
    let tmp = point.clone();
    pointCentralSymmetry(point, maths.projectPointOnLine(tmp, axis));
    tmp.dispose();
    return point;
}

export function circleAxialSymmetry(circle, axis){
    pointAxialSymmetry(circle.center, axis);
    return circle;
}

export function lineAxialSymmetry(line, axis){
    pointAxialSymmetry(line.point, axis);
    pointAxialSymmetry(line.vector.sub(line.point).add(axis.point), axis);
    return line;
}


/** central symmetry **/
export function pointCentralSymmetry(point, center){
    point.set(
        2 * center.x - point.x,
        2 * center.y - point.y
    );
    return point;
}

export function circleCentralSymmetry(circle, center){
    pointCentralSymmetry(circle.center, center);
    return circle;
}

export function lineCentralSymmetry(line, axis){
    pointCentralSymmetry(line.point, axis);
    line.vector.multiplyScalar(-1);
    return line;
}


/** rotations **/
export function pointRotation(point, center, angle){
    return point.sub(center).rotate(angle).add(center);
}

export function circleRotation(circle, center, angle){
    pointRotation(circle.center, center, angle);
    return circle;
}

export function lineRotation(line, center, angle){
    pointRotation(line.point, center, angle);
    line.vector.rotate(angle);
    return line;
}


/** homothecy **/
export function pointHomothecy(point, center, scale){
    return point.sub(center).multiplyScalar(scale);
}

export function circleHomotecy(circle, center, scale){
    pointHomothecy(circle.center, center, scale);
    circle.radius *= scale;
    return circle;
}

export function lineHomotecy(line, center, scale){
    pointHomothecy(line.point);
    line.vector.multiplyScalar(scale);
    return line;
}

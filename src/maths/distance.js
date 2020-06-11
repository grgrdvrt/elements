import * as maths from "./index";

export function pointsDistance(v1, v2){
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    return Math.hypot(dx, dy);
}

export function pointLineDistance(vector, line){
    const l2 = new maths.Line(vector, new maths.Vector2(-line.vector.y, line.vector.x));
    const p = maths.linesIntersection(line, l2);
    return pointsDistance(vector, p);
}

export function pointCircleDistance(v, c){
    return pointsDistance(v, c.center) - c.radius;
}

export function circlesDistance(c1, c2){
    return pointsDistance(c1.center, c2.center) - (c1.radius + c2.radius);
}

export function lineCircleDistance(l, c){
    return pointLineDistance(c.center, l) - c.radius;
}

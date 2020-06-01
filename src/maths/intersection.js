import * as maths from "./index";

export function linesIntersection(l1, l2, v = new maths.Vector2){
    const xv1 = l1.vector.x;
    const yv1 = l1.vector.y;
    const xv2 = l2.vector.x;
    const yv2 = l2.vector.y;
    const dxp = l2.point.x - l1.point.x;
    const dyp = l2.point.y - l1.point.y;

    const t = (yv2 * dxp - xv2 * dyp) / (xv1 * yv2 - xv2 * yv1);

    return l1.getPointAt(t, v);
}

export function lineCircleIntersection(line, circle, v1 = new maths.Vector2(), v2 = new maths.Vector2()){
    const v = line.vector;
    const p = line.point;
    const c = circle.center;
    const r = circle.radius;

    const roots = maths.quadraticRoots(
        v.dot(v),
        2 * (p.x * v.x + p.y * v.y - c.x * v.x - c.y * v.y),
        c.dot(c) + p.dot(p) - 2 * (c.x * p.x + c.y * p.y) - r * r
    );
    line.getPointAt(roots.x1, v1);
    line.getPointAt(roots.x2, v2);
}

export function circlesIntersections(circle1, circle2, v1 = new maths.Vector2(), v2 = new maths.Vector2()){
    const c1 = circle1.center;
    const c2 = circle2.center;
    const r1 = circle1.radius;
    const r2 = circle2.radius;

    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const ddx = c2.x*c2.x - c1.x*c1.x;
    const ddy = c2.y*c2.y - c1.y*c1.y;
    const ddr = r1*r1 - r2*r2;

    const s1 = dx / dy;
    const s2 = (ddr + ddx + ddy) / dy;
    const s3 = c1.y - s2/2;

    let roots, f;
    if(dy === 0){
        const x = (ddx + ddr)/(2*dx);
        const dx2 = c1.x - x;
        roots = maths.quadraticRoots(
            1,
            -2 * c1.y,
            c1.y*c1.y + dx2*dx2 - r1*r1
        );
        f = (v, y) => v.set(x, y);
    }
    else {
        roots = maths.quadraticRoots(
            1 + s1*s1,
            2 * (s1*s3 - c1.x),
            s3*s3 + c1.x*c1.x - r1*r1
        );
        f = (v, x) => v.set(x, s2/2 - s1*x);
    }
    if(c2.y > c1.y){
        const t = roots.x1;
        roots.x1 = roots.x2;
        roots.x2 = t;
    }
    f(v1, roots.x1);
    f(v2, roots.x2);
    return {v1, v2};
}

//https://stackoverflow.com/questions/3838329/how-can-i-check-if-two-segments-intersect

function ccw(a, b, c) {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
}
export function segmentIntersect(s1, s2) {
    return ccw(s1[0], s2[0], s2[1]) !== ccw(s1[1], s2[0], s2[1])
        && ccw(s1[0], s1[1], s2[0]) !== ccw(s1[0], s1[1], s2[1]);
}

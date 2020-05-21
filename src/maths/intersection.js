import * as maths from "./index";

export function linesIntersection(l1, l2, v = new maths.Vector2){
  let xv1 = l1.vector.x;
  let yv1 = l1.vector.y;
  let xv2 = l2.vector.x;
  let yv2 = l2.vector.y;
  let dxp = l2.point.x - l1.point.x;
  let dyp = l2.point.y - l1.point.y;

  let t = (yv2 * dxp - xv2 * dyp) / (xv1 * yv2 - xv2 * yv1);

  return l1.getPointAt(t, v);
}

export function lineCircleIntersection(line, circle, v1 = new maths.Vector2(), v2 = new maths.Vector2()){
  let v = line.vector;
  let p = line.point;
  let c = circle.center;
  let r = circle.radius;

  let roots = maths.quadraticRoots(
    v.dot(v),
    2 * (p.x * v.x + p.y * v.y - c.x * v.x - c.y * v.y),
    c.dot(c) + p.dot(p) - 2 * (c.x * p.x + c.y * p.y) - r * r
  );
  line.getPointAt(roots.x1, v1);
  line.getPointAt(roots.x2, v2);
}

export function circlesIntersections(circle1, circle2, v1 = new maths.Vector2(), v2 = new maths.Vector2()){
  let c1 = circle1.center;
  let c2 = circle2.center;
  let r1 = circle1.radius;
  let r2 = circle2.radius;


  let dx = c2.x - c1.x;
  let dy = c2.y - c1.y;
  let ddx = c2.x*c2.x - c1.x*c1.x;
  let ddy = c2.y*c2.y - c1.y*c1.y;
  let ddr = r1*r1 - r2*r2;

  let s1 = dx / dy;
  let s2 = (ddr + ddx + ddy) / dy;
  let s3 = c1.y - s2/2;

  let roots, f;
  if(dy === 0){
    let x = (ddx + ddr)/(2*dx);
    let dx2 = c1.x - x;
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
    let t = roots.x1;
    roots.x1 = roots.x2;
    roots.x2 = t;
  }
  f(v1, roots.x1);
  f(v2, roots.x2);
  return {v1, v2};
}

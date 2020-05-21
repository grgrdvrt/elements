export * from "./Vector2";
export * from "./Matrix3";
export * from "./Line";
export * from "./Segment";
export * from "./Circle";
export * from "./Rectangle";
export * from "./intersection";
export * from "./projection";
export * from "./distance";
export * from "./symmetry";

export function quadraticRoots(a, b, c){
  let ds = Math.sqrt(b * b - 4 * a * c);
  return {
    x1: (-b - ds) / (2 * a),
    x2: (-b + ds) / (2 * a)
  };
}

export function lerp(a, b, t){
  return a + t * (b - a);
}

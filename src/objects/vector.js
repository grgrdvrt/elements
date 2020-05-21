import {drawVector} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";

import {Construction} from "../api/Construction";


import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,
} from "../api/types";

export function baseVector(){
  return {
    type : vectorType,
    style : new Style({stroke:"black"}),
    drawingFunc : drawVector,
    geom : new maths.Segment()
  };
}

export function vector(p1, p2){
  const vector = baseVector();
  vector.construction = new Construction({
    input:{p1, p2},
    output:vector,
    update(input, output){
      const s = output.geom;
      s.p1.copy(input.p1.geom);
      s.p2.copy(input.p2.geom);
    }
  });
  return vector;
}

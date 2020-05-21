import {drawSegment} from "../gui/graphics/drawing";
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

export function baseSegment(){
  return {
    type : segmentType,
    style : new Style({stroke:"black"}),
    drawingFunc : drawSegment,
    geom : new maths.Segment()
  };
}

export function segment(...params){
  if(params.length === 1 && params[0].type === vectorType){
    return segmentFromVector(params[0]);
  }
  else if(params[0].type === pointType && params[1].type === pointType){
    return segmentFromPoints(params[0], params[1]);
  }
  else if(params[0].type === pointType && params[1].type === vectorType){
    return segmentFromPointVector(params[0], params[1]);
  }
  else {
    throw new Error("no line constructor for given params : " + params.join(", "));
  }
}


export function segmentFromPoints(p1, p2){
  const segment = baseSegment();
  Object.assign(
    segment,
    {
      construction:new Construction({
        description:"segment from points",
        input:{p1, p2},
        output:segment,
        update : function(input, output){
          const s = output.geom;
          s.p1.copy(input.p1.geom);
          s.p2.copy(input.p2.geom);
        }
      })
    }
  );
  return segment;
}

export function segmentFromVector(vector){
  const segment = baseSegment();
  Object.assign(
    segment,
    {
      construction:new Construction({
        description:"segment from vector",
        input:{vector},
        output:segment,
        update : function(input, output){
          const s = output.geom;
          s.p1.copy(input.vector.p1.geom);
          s.p2.copy(input.vector.p2.geom);
        }
      })
    }
  );
  return segment;
}

export function segmentFromPointVector(point, vector){
  const segment = baseSegment();
  Object.assign(
    segment,
    {
      construction:new Construction({
        description:"segment from point vector",
        input:{point, vector},
        output:segment,
        update : function(input, output){
          const s = output.geom;
          const p = input.point.geom;
          s.copy(p);
          s.copy(p).add(input.vector.geom);
        }
      })
    }
  );
  return segment;
}

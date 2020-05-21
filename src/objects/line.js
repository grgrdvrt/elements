import {drawLine} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";

import {Construction} from "../api/Construction";
import {scalar} from "./scalar";
import {point, pointOnPerpendicular} from "./point";


import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,
} from "../api/types";

export function baseLine(){
  return {
    type:lineType,
      style : new Style({stroke:"black"}),
    drawingFunc : drawLine,
    geom:new maths.Line()
  };
}

export function line(a, b){
  if(a.type === pointType && b.type === pointType){
    return lineFromPoints(a, b);
  }
  else if(a.type === pointType && b.type === vectorType){
    return lineFromPointVector();
  }

  if(!Number.isNaN(a)){
    a = scalar(a);
  }
  if(!Number.isNaN(b)){
    b = scalar(b);
  }

  if(a.type === pointType && b.type === scalarType){
    throw new Error("not implemented yet");
  }
  else if(a.type === vectorType && b.type === scalarType){
    throw new Error("not implemented yet");
  }
  else if(a.type === scalarType && b.type === scalarType){
    throw new Error("not implemented yet");
  }
  else {
    throw new Error("no line constructor for given params : " + a + ", " + b);
  }
}


export function lineFromPoints(p1, p2){
  const line = baseLine();
  line.construction = new Construction ({
    description:"line from points",
    input:{p1, p2},
    output:line,
    update : function(input, output) {
      const l = output.geom;
      l.point.copy(input.p1.geom);
      l.vector.copy(input.p2.geom).sub(input.p1.geom);
    }
  });
  return line;
}


export function lineFromPointVector(point, vector){
  const line = baseLine();
  line.construction = new Construction({
    description:"line from (point, vector)",
    input:{point, vector},
    output:line,
    update : function(input, output){
      output.geom.set(input.point.geom, input.vector.geom);
    }
  });
  return line;
}


export function perpendicular(line, point){
  return lineFromPoints(point, pointOnPerpendicular(line, point));
}

export function segmentBissector(segment){
  const line = baseLine();
  line.construction = new Construction({
    description:"segment bissector",
    input:{segment},
    output:line,
    update : function(input, output){
      const p1 = input.segment.geom.p1;
      const p2 = input.segment.geom.p2;
      const line = output.geom;
      line.point.lerp(p1, p2, 0.5);
      line.vector.set(p1.y - p2.y, p2.x - p1.x);
    }
  });
  return line;
}

export function angleBissector(p1, p2, p3){
    const line = baseLine();
    const tmp = new maths.Vector2()
    line.construction = new Construction({
        description:"angle bissector",
        input:{p1, p2, p3},
        output:line,
        update : function(input, output){
            const p1 = input.p1.geom;
            const p2 = input.p2.geom;
            const p3 = input.p3.geom;
            const len = maths.Vector2.dist(p2, p3)
            tmp.copy(p1).sub(p2).setLength(len).add(p2);
            tmp.lerp(tmp, p3, 0.5);

            const line = output.geom;
            line.point.copy(p2);
            line.vector.copy(tmp).sub(p2).normalize();
        }
    });
    return line;
}

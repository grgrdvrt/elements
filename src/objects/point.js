import {drawPoint} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";

import {
    Construction,
    defaultConstruction
} from "../api/Construction";
import {segmentBissector} from "./line"
import {segment} from "./segment"


import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,
} from "../api/types";

export function basePoint(){
  return {
    type : pointType,
    style : new Style({fill:"black"}),
    drawingFunc : drawPoint,
    geom : new maths.Vector2(),
  };
}


export function point(x, y){
  const pt = basePoint();
  pt.geom.set(x, y);
  pt.construction = defaultConstruction;
  return pt;
}


export function randomPoint(area){
  return point(
    area.x + Math.random() * area.width,
    area.y + Math.random() * area.height
  );
}

export function middle(segment){
  const pt = basePoint();
  pt.construction = new Construction({
    description:"segment middle",
    input:{segment},
    output:pt,
    update : function(input, output){
      output.geom.lerp(input.segment.geom.p1, input.segment.geom.p2, 0.5);
    }
  });
  return pt;
}


export function pointOnPerpendicular(line, point){
  const pt = basePoint();
  pt.construction = new Construction({
    description:"point on perpendicular",
    input:{line, point},
    output:pt,
    update : function(input, output){
      const pt = input.point.geom;
      const v = input.line.geom.vector;
      output.geom.set(pt.x - v.y, pt.y + v.y);
    }
  });
  return pt;
}

export function barycenter(pts, weights){
    if(weights === undefined){
        weights = pts.map(() => 1);
    }
    const pt = basePoint();
    const tmp = new maths.Vector2();
    pt.construction = new Construction({
        description:"barycenter",
        input:{pts, weights},
        output:pt,
        helpers:{},
        update : function(input, output){
            output.geom.set(0, 0);
            input.pts.forEach((pt, i) => {
                output.geom.add(tmp.copy(pt.geom).multiplyScalar(weights[i]));
            })
            output.geom.multiplyScalar(1 / weights.reduce((t, w) => t + w, 0));
        }
    });
    return pt;
}


export function circumCenter(p1, p2, p3){
  const l1 = segmentBissector(segment(p1, p2));
  const l2 = segmentBissector(segment(p1, p3));
  const pt = basePoint();
  pt.construction = new Construction({
    description:"circum center",
    input:{p1, p2, p3},
    output:pt,
    helpers:{l1, l2},
    update : function(input, output, helpers){
      maths.linesIntersection(helpers.l1.geom, helpers.l2.geom, output.geom);
    }
  });
  return pt;
}


export function lineCircleIntersections(line, circle){
  const pts = [basePoint(), basePoint()];
  const construction = new Construction({
    description:"line circle intersections",
    input:{line, circle},
    output:pts,
    update : function(input, output){
      maths.lineCircleIntersection(input.line.geom, input.circle.geom, output[0].geom, output[1].geom);
    }
  });
  pts[0].construction = pts[1].construction = construction;
  return pts;
}


export function circlesIntersections(c1, c2){
  const pts = [basePoint(), basePoint()];
  const construction = new Construction({
    description:"circles intersections",
    input:{c1, c2},
    output:pts,
    update : function(input, output){
      maths.circlesIntersections(input.c1.geom, input.c2.geom, output[0].geom, output[1].geom);
    }
  });
  pts[0].construction = pts[1].construction = construction;
  return pts;
}


export function linesIntersection(l1, l2){
  const pt = basePoint();
  pt.construction = new Construction({
    description:"lines intersection",
    input:{l1, l2},
    output:pt,
    update : function(input, output){
      maths.linesIntersection(input.l1.geom, input.l2.geom, output.geom);
    }
  });
  return pt;
}

/**
 * position:Vector2 only used at creation
 */
export function pointOnObject(obj, position){
  switch(obj.type){
  case pointType:
    return obj;
  case circleType:
    return pointOnCircle(obj, position);
  case lineType:
    return pointOnLine(obj, position);
  default :
    throw new Error("no implementation for type : " + obj.type);
    break;
  }
}

export function pointOnLine(line, position){
  const pt = basePoint();
  pt.geom.copy(position);
  pt.construction = new Construction({
    description:"point on line",
    input:{line},
    output:pt,
    update : function(input, output){
      maths.projectVectorOnLine(output.geom, input.line.geom);
    }
  });
  return pt;
}

export function pointOnCircle(circle, position){
  const pt = basePoint();
  pt.geom.copy(position);
  pt.construction = new Construction({
    description:"point on circle",
    input:{circle},
    output:pt,
    update : function(input, output){
      maths.projectVectorOnCircle(output.geom, input.circle.geom, output.geom);
    }
  });
  return pt;
}


export function mouse(stage, mouse){
  const pt = basePoint();
  Object.assign(
    pt,
    {
      selectable : false,
      construction : new Construction({
        description:"mouse",
        input:{},
        output:pt,
        update : function(input, output){
          output.geom.copy(mouse.position);
        }
      })
    });
  return pt;
}

export function pointCentralSymmetry(point, center){
  const pt = basePoint();
  Object.assign(
    pt,
    {
      construction : new Construction({
        description:"point central symmetry",
        input:{point, center},
        output:pt,
        update : function(input, output){
          maths.pointCentralSymmetry(output.geom.copy(input.point.geom), center);
        }
      })
    });
  return pt;
}

export function pointAxialSymmetry(point, axis){
  const pt = basePoint();
  Object.assign(
    pt,
    {
      construction : new Construction({
        description:"point axial symmetry",
        input:{point, axis},
        output:pt,
        update : function(input, output){
          maths.pointaxialSymmetry(output.geom.copy(input.point.geom), axis);
        }
      })
    });
  return pt;
}

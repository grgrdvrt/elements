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
        output : new maths.Vector2(),
    };
}


export function point(x, y){
    const pt = basePoint();
    pt.output.set(x, y);
    pt.construction = defaultConstruction;
    return pt;
}


export const randomPoint = (area) => {
    return point(
        area.x + Math.random() * area.width,
        area.y + Math.random() * area.height
    );
};

export const middle = (segment) => ({
    description:"segment middle",
    ...basePoint(),
    input:{segment},
    update : function(input, output){
        output.lerp(input.segment.output.p1, input.segment.output.p2, 0.5);
    }
});


export const pointOnPerpendicular = (line, point) => ({
    description:"point on perpendicular",
    ...basePoint(),
    input:{line, point},
    update : function(input, output){
        const pt = input.point.output;
        const v = input.line.output.vector;
        output.set(pt.x - v.y, pt.y + v.y);
    }
});

export const barycenter = (pts, weights) => {
    if(weights === undefined){
        weights = pts.map(() => 1);
    }
    const tmp = new maths.Vector2();
    return {
        description:"barycenter",
        ...basePoint(),
        input:{pts, weights},
        helpers:{},
        update : function(input, output){
            output.set(0, 0);
            input.pts.forEach((pt, i) => {
                output.add(tmp.copy(pt.output).multiplyScalar(weights[i]));
            })
            output.multiplyScalar(1 / weights.reduce((t, w) => t + w, 0));
        }
    };
};


export const circumCenter = (p1, p2, p3) => {
    const l1 = segmentBissector(segment(p1, p2));
    const l2 = segmentBissector(segment(p1, p3));
    return {
        description:"circum center",
        ...basePoint(),
        input:{p1, p2, p3},
        helpers:{l1, l2},
        update : function(input, output, helpers){
            maths.linesIntersection(helpers.l1.output, helpers.l2.output, output);
        }
    };
};


export const lineCircleIntersections = (line, circle) => {
    const construction = {
        description:"line circle intersections",
        input:{line, circle},
        output : [basePoint(), basePoint()],//FIXME
        update : function(input, output){
            maths.lineCircleIntersection(input.line.output, input.circle.output, output[0].output, output[1].output);
        }
    };
    return [
        {...basePoint(), construction},
        {...basePoint(), construction},
    ]
};


export function circlesIntersections(c1, c2){
    const pts = [basePoint(), basePoint()];
    const construction = new Construction({
        description:"circles intersections",
        input:{c1, c2},
        output:pts,
        update : function(input, output){
            maths.circlesIntersections(input.c1.output, input.c2.output, output[0].output, output[1].output);
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
            maths.linesIntersection(input.l1.output, input.l2.output, output.output);
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

export const pointOnLine = (line, position) => {
    const pt = basePoint();
    pt.output.copy(position);
    return {
        ...pt,
        description:"point on line",
        input:{line},
        output:pt,
        update : function(input, output){
            maths.projectVectorOnLine(output, input.line.output);
        }
    };
};

export function pointOnCircle(circle, position){
    const pt = basePoint();
    pt.output.copy(position);
    pt.construction = new Construction({
        description:"point on circle",
        input:{circle},
        output:pt,
        update : function(input, output){
            maths.projectVectorOnCircle(output.output, input.circle.output, output.output);
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
                    output.output.copy(mouse.position);
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
                    maths.pointCentralSymmetry(output.output.copy(input.point.output), center);
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
                    maths.pointaxialSymmetry(output.output.copy(input.point.output), axis);
                }
            })
        });
    return pt;
}

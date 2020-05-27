import {drawSegment} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";

import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,
} from "../api/types";

let id = 0;
export function baseSegment(){
    return {
        type : segmentType,
        name : `Segment_${id++}`,
        style : new Style({stroke:"black"}),
        drawingFunc : drawSegment,
        geom : new maths.Segment()
    };
}



export const segmentFromPoints = (p1, p2) => ({
    ...baseSegment(),
    description:"segment from points",
    input:{p1, p2},
    update : ({geom}) => {
        geom.p1.copy(p1.geom);
        geom.p2.copy(p2.geom);
    }
});

export const segmentFromVector = (vector) => ({
    ...baseSegment(),
    description:"segment from vector",
    input:{vector},
    update : ({geom}) => {
        geom.p1.copy(vector.p1.geom);
        geom.p2.copy(vector.p2.geom);
    }
});

export const segmentFromPointVector = (point, vector) => ({
    ...baseSegment(),
    description:"segment from point vector",
    input:{point, vector},
    update : ({geom}) => {
        geom.copy(point.geom);
        geom.copy(point.geom).add(vector.geom);
    }
});

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

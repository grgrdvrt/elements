import {drawVector} from "../gui/graphics/drawing";
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
export function baseVector(){
    return {
        type : vectorType,
        name : `Vector_${id++}`,
        style : new Style({stroke:"black"}),
        drawingFunc : drawVector,
        geom : new maths.Segment()
    };
}

export const vector = (p1, p2) => ({
    ...baseVector(),
    description:"Vector point point",
    input:{p1, p2},
    update({geom}){
        geom.p1.copy(p1.geom);
        geom.p2.copy(p2.geom);
    }
});

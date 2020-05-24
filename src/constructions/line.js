import {drawLine} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";

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
        output:null,
        geom:new maths.Line(),
        lastUpdated:-1,
    };
}


export const lineFromPoints = (p1, p2) => ({
    ...baseLine(),
    description:"line from points",
    input:{p1, p2},
    geom:line,
    update({geom}){
        geom.point.copy(p1.geom);
        geom.vector.copy(p2.geom).sub(p1.geom);
    }
});


export const lineFromPointVector = (point, vector) => ({
    description:"line from (point, vector)",
    ...baseLine(),
    input:{point, vector},
    geom:line,
    update({geom}){
        geom.set(point.geom, vector.geom);
    }
});


export const perpendicular = (line, point) => {
    return lineFromPoints(point, pointOnPerpendicular(line, point));
};

export const segmentBissector = segment => ({
    description:"segment bissector",
    ...baseLine(),
    input:{segment},
    update({geom}){
        const p1 = segment.geom.p1;
        const p2 = segment.geom.p2;
        geom.point.lerp(p1, p2, 0.5);
        geom.vector.set(p1.y - p2.y, p2.x - p1.x);
    }
});

export const angleBissector = (p1, p2, p3) => {
    const tmp = new maths.Vector2()
    return {
        description:"angle bissector",
        ...baseLine(),
        input:{p1, p2, p3},
        geom:line,
        update({input, geom}){
            const p1 = input.p1.geom;
            const p2 = input.p2.geom;
            const p3 = input.p3.geom;
            const len = maths.Vector2.dist(p2, p3)
            tmp.copy(p1).sub(p2).setLength(len).add(p2);
            tmp.lerp(tmp, p3, 0.5);

            geom.point.copy(p2);
            geom.vector.copy(tmp).sub(p2).normalize();
        }
    };
};

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

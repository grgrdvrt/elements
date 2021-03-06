import {drawPolygon} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";
import {basePoint} from "./point"

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
export function basePolygon(pts){
    return {
        type : polygonType,
        name : `Polygon_${id++}`,
        style : new Style({stroke:"black"}),
        drawingFunc : drawPolygon,
        geom : pts
    };
}



export const regularPolygon = (center, vertex, sides) => {
    const pts = [vertex.geom];
    for(let i = 0; i < sides - 1; i++){
        pts.push(new maths.Vector2());
    }
    return {
        ...basePolygon(pts),
        description:"regular polygon",
        input : {center, vertex, sides},
        update : ({geom}) => {
            const diff = vertex.geom.clone().sub(center.geom);
            const radius = diff.getLength();
            const angBegin = Math.atan2(diff.y, diff.x);
            geom.forEach((pt, i) => {
                if(i === 0) return;
                const ang = angBegin + i * 2 * Math.PI / sides;
                pt.x = Math.cos(ang);
                pt.y = Math.sin(ang);
                pt.multiplyScalar(radius).add(center.geom);
            });
        }
    };
};

export function polygon(...pts){
    if(Array.isArray(pts[0])){
        pts = pts[0];
    }
    if(pts[0].type === pointType){
        pts = pts.map(p => p.geom);
    }
    return basePolygon(pts);
}

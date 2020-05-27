import {drawPoint} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";

import {segmentBissector} from "./line";
import {segment} from "./segment";


import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,
    untyped,
    listType,

    makeTypedFunction
} from "../api/types";

let id = 0;
export function basePoint(){
    return {
        type : pointType,
        name : `Point_${id++}`,
        style : new Style({fill:"black"}),
        drawingFunc : drawPoint,
        geom : new maths.Vector2(),
    };
}



export const randomPoint = (area) => {
    return point(
        area.x + Math.random() * area.width,
        area.y + Math.random() * area.height
    );
};

export const middle = makeTypedFunction(
    [segmentType],
    (segment) => ({
        description:"segment middle",
        ...basePoint(),
        input:{segment},
        update({input, geom}){
            geom.lerp(input.segment.geom.p1, input.segment.geom.p2, 0.5);
        }
    })
);


export const pointOnPerpendicular = makeTypedFunction(
    [lineType, pointType],
    (line, point) => ({
        description:"point on perpendicular",
        ...basePoint(),
        input:{line, point},
        update({input, geom}){
            const pt = input.point.geom;
            const v = input.line.geom.vector;
            geom.set(pt.x - v.y, pt.y + v.y);
        }
    })
);

export const barycenter = makeTypedFunction(
    [listType(pointType), listType(scalarType)],
    (pts, weights) => {
        if(weights === undefined){
            weights = pts.map(() => 1);
        }
        const tmp = new maths.Vector2();
        return {
            description:"barycenter",
            ...basePoint(),
            input:{pts, weights},
            helpers:{},
            update({geom}){
                geom.set(0, 0);
                pts.forEach((pt, i) => {
                    geom.add(tmp.copy(pt.geom).multiplyScalar(weights[i]));
                });
                geom.multiplyScalar(1 / weights.reduce((t, w) => t + w, 0));
            }
        };
    }
);


export const circumCenter = makeTypedFunction(
    [pointType, pointType, pointType],
    (p1, p2, p3) => {
        const l1 = segmentBissector(segment(p1, p2));
        const l2 = segmentBissector(segment(p1, p3));
        return {
            description:"circum center",
            ...basePoint(),
            input:{p1, p2, p3},
            helpers:{l1, l2},
            update({geom, helpers}){
                maths.linesIntersection(helpers.l1.geom, helpers.l2.geom, geom);
            }
        };
    }
);


export const lineCircleIntersections = makeTypedFunction(
    [lineType, circleType],
    (line, circle) => {
        return {
            description:"line circle intersections",
            input:{line, circle},
            output : [basePoint(), basePoint()],
            update({output}){
                maths.lineCircleIntersection(line.geom, circle.geom, output[0].geom, output[1].geom);
            }
        };
    }
);


export const circlesIntersections = makeTypedFunction(
    [circleType, circleType],
    (c1, c2) => {
        const result = {
            description:"circles intersections",
            input:{c1, c2},
            type : listType(pointType),
            update({output}){
                maths.circlesIntersections(c1.geom, c2.geom, output[0].geom, output[1].geom);
            }
        };
        result.output = [basePoint(), basePoint()].map(p => ({
            ...p,
            description:"circles intersection",
            input:{c1, c2},
            helpers:{result}
        }));
        return result;
    }
);


export const linesIntersection = makeTypedFunction(
    [lineType, lineType],
    (l1, l2) => {
        const pt = basePoint();
        return {
            ...pt,
            description:"lines intersection",
            input:{l1, l2},
            update({geom}){
                maths.linesIntersection(l1.geom, l2.geom, geom);
            }
        };
    }
);

export const pointOnLine = makeTypedFunction(
    [lineType, untyped],
    (line, position) => {
        const pt = basePoint();
        pt.geom.copy(position);
        return {
            ...pt,
            description:"point on line",
            input:{line},
            update({geom}){
                maths.projectVectorOnLine(geom, line.geom);
            }
        };
    }
);

export const pointOnCircle = makeTypedFunction(
    [circleType, untyped],
    (circle, position) => {
        const pt = basePoint();
        pt.geom.copy(position);
        return {
            ...pt,
            description:"point on circle",
            input:{circle},
            update({geom}){
                maths.projectVectorOnCircle(geom, circle.geom, geom);
            }
        };
    }
);


export const mouse = (stage, mouse) => ({
    ...basePoint(),
    selectable : false,
    description:"mouse",
    input:{},
    update({geom}){
        geom.copy(mouse.position);
    }
});

export const pointCentralSymmetry = makeTypedFunction(
    [pointType, pointType],
    (point, center) => ({
        ...basePoint(),
        description:"point central symmetry",
        input:{point, center},
        update({geom}){
            maths.pointCentralSymmetry(geom.copy(point.geom), center);
        }
    })
);

export const pointAxialSymmetry = makeTypedFunction(
    [pointType, lineType],
    (point, axis) => ({
        ...basePoint(),
        description:"point axial symmetry",
        input:{point, axis},
        update({geom}){
            maths.pointaxialSymmetry(geom.copy(point.geom), axis);
        }
    })
);


export function point(x, y){
    const pt = basePoint();
    pt.geom.set(x, y);
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

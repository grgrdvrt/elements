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

    makeTypedFunction,
    makeDispatch
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
        const pts = [basePoint(), basePoint()];
        return pts.map(p => ({
            ...p,
            description:"line circle intersection",
            input:{line, circle},
            update({}, timestamp){
                pts[0].lastUpdated = pts[1].lastUpdated = timestamp;
                const hasIntersection = maths.lineCircleDistance(line.geom, circle.geom) <= circle.geom.radius;
                if(hasIntersection){
                    maths.lineCircleIntersection(line.geom, circle.geom, pts[0].geom, pts[1].geom);
                }
                return hasIntersection;
            }
        }));
    }
);


export const circlesIntersections = makeTypedFunction(
    [circleType, circleType],
    (c1, c2) => {
        const pts = [basePoint(), basePoint()];
        return pts.map(p => ({
            ...p,
            description:"circles intersection",
            input:{c1, c2},
            update({input}, timestamp){
                pts[0].lastUpdated = pts[1].lastUpdated = timestamp;
                const r1 = c1.geom.radius;
                const r2 = c2.geom.radius;
                const d = maths.Vector2.dist(c1.geom.center, c2.geom.center);
                const hasIntersection = d < r1 + r2 && d > Math.abs(r1 - r2);
                pts[0].isValid = pts[1].isValid = hasIntersection;
                if(hasIntersection){
                    maths.circlesIntersections(c1.geom, c2.geom, pts[0].geom, pts[1].geom);
                }
                return hasIntersection;
            }
        }));
    }
);


export const linesIntersection = makeTypedFunction(
    [lineType, lineType],
    (l1, l2) => {
        return {
            ...basePoint(),
            description:"lines intersection",
            input:{l1, l2},
            update({geom}){
                const hasIntersection = l1.geom.vector.cross(l2.geom.vector) !== 0;
                if(hasIntersection){
                    maths.linesIntersection(l1.geom, l2.geom, geom);
                }
                return hasIntersection;
            }
        };
    }
);

export const segmentsIntersection = makeTypedFunction(
    [segmentType, segmentType],
    (s1, s2) => {
        return {
            ...basePoint(),
            description:"segments intersection",
            input:{s1, s2},
            update({geom}){
                const hasIntersection = maths.segmentsIntersect(s1.geom, s2.geom);
                if(hasIntersection){
                    maths.segmentsIntersection(s1.geom, s2.geom, geom);
                }
                return hasIntersection;
            }
        };
    }
);

export const segmentCirleIntersection = makeTypedFunction(
    [segmentType, circleType],
    (segment, circle) => {
        return {
            ...basePoint(),
            description:"segments intersection",
            input:{segment, circle},
            update({geom}){
                const hasIntersection = maths.segmentsIntersect(segment.geom, circle.geom);
                if(hasIntersection){
                    maths.segmentCircleIntersection(segment.geom, circle.geom, geom);
                }
                return hasIntersection;
            }
        };
    }
);

export const segmentLineIntersection = makeTypedFunction(
    [segmentType, lineType],
    (segment, line) => {
        return {
            ...basePoint(),
            description:"segments intersection",
            input:{segment, line},
            update({geom}){
                const hasIntersection = maths.segmentsIntersect(segment.geom, line.geom);
                if(hasIntersection){
                    maths.segmentLineIntersection(segment.geom, line.geom, geom);
                }
                return hasIntersection;
            }
        };
    }
);


export const intersection = makeDispatch(
    lineCircleIntersections,
    circlesIntersections,
    linesIntersection
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



/** transforms **/

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
            maths.pointAxialSymmetry(geom.copy(point.geom), axis);
        }
    })
);

export const pointTranslation = makeTypedFunction(
    [pointType, vectorType],
    (point, vector) => ({
        ...basePoint(),
        description:"point translation",
        input:{point, vector},
        update({geom}){
            geom.copy(point.geom)
                .sub(vector.geom.p1)
                .add(vector.geom.p2);
        }
    })
);

export const pointRotation = makeTypedFunction(
    [pointType, pointType, scalarType],
    (point, center, angle) => ({
        ...basePoint(),
        description:"point rotation",
        input:{point, center, angle},
        update({geom}){
            maths.pointRotation(geom.copy(point.geom), center.geom, angle);
        }
    })
);


export const pointHomothecy = makeTypedFunction(
    [pointType, pointType, scalarType],
    (point, center, scale) => ({
        ...basePoint(),
        description:"point homotecy",
        input:{point, center, scale},
        update({geom}){
            maths.pointHomothecy(geom.copy(point.geom), center.geom, scale);
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
export const pointOnObject = makeDispatch(
    makeTypedFunction([pointType, untyped], _ => _),//point on point
    pointOnCircle,
    pointOnLine,
);

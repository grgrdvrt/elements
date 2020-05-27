import {drawCircle} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";

import {scalar} from "./scalar";
import {circumCenter} from "./point";

import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,
} from "../api/types";


import {
    makeTypedFunction,
    makeDispatch
} from "../api/types";

let id = 0;
export function baseCircle(){
    return {
        type : circleType,
        name : `Circle_${id++}`,
        style : new Style({stroke : "black"}),
        drawingFunc : drawCircle,
        geom : new maths.Circle(),
        output:null,
        lastUpdated : -1
    };
}



export const circumCircle = makeTypedFunction(
    [pointType, pointType, pointType],
    (p1, p2, p3) => ({
        ...baseCircle(),
        description : "circum circle",
        input : {p1, p2, p3},
        helpers : {center : circumCenter(p1, p2, p3)},
        update({geom, helpers}){
            geom.center.copy(helpers.center.geom);
            geom.radius = maths.Vector2.dist(helpers.center.geom, p1.geom);
        }
    })
);


export const circleFromCenterPoint = makeTypedFunction(
    [pointType, pointType],
    (center, point) => ({
        ...baseCircle(),
        description:"Circle from (center, point)",
        input:{center, point},
        update({geom}){
            geom.center.copy(center.geom);
            geom.radius = maths.Vector2.dist(geom.center, point.geom);
        }
    })
);


export const circleFromCenterRadius = makeTypedFunction(
    [pointType, scalarType],
    (center, radius) => ({
        ...baseCircle(),
        description:"Circle from (center, radius)",
        input:{center, radius:scalar(radius)},
        update({geom}){
            geom.center.copy(center.geom);
            geom.radius = radius.value;
        }
    })
);

/** transforms **/

export const circleAxialSymmetry = makeTypedFunction(
    [circleType, lineType],
    (c, axis) => ({
        ...baseCircle(),
        description : "circle axial symmetry",
        input : {c, axis},
        update({geom}){
            maths.circleAxialSymmetry(geom.copy(c.geom), axis.geom);
        }
    })
);

export const circleCentralSymmetry = makeTypedFunction(
    [circleType, pointType],
    (c, center) => ({
        ...baseCircle(),
        description:"circle central symmetry",
        input : {c, center},
        update({geom}){
            maths.circleCentralSymmetry(geom.copy(c.geom), center.geom);
        }
    })
);

export const circleTranslation = makeTypedFunction(
    [circleType, vectorType],
    (circle, vector) => ({
        ...baseCircle(),
        description:"circle translation",
        input:{circle, vector},
        update({geom}){
            geom.copy(circle.geom);
            geom.center.sub(vector.geom.p1)
                .add(vector.geom.p2);
        }
    })
);

export const circleRotation = makeTypedFunction(
    [circleType, pointType, scalarType],
    (circle, center, angle) => ({
        ...baseCircle(),
        description:"circle rotation",
        input:{circle, center, angle},
        update({geom}){
            maths.circleRotation(geom.copy(circle.geom), center.geom, angle);
        }
    })
);


export const circleHomothecy = makeTypedFunction(
    [circleType, pointType, scalarType],
    (circle, center, scale) => ({
        ...baseCircle(),
        description:"circle homotecy",
        input:{circle, center, scale},
        update({geom}){
            maths.circleHomothecy(geom.copy(circle.geom), center.geom, scale);
        }
    })
);


export const circle = makeDispatch(
    circumCircle,
    circleFromCenterPoint,
    circleFromCenterRadius,
);

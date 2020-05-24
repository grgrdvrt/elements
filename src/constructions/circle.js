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


import {makeDispatch} from "../api/types";

export function baseCircle(){
    return {
        type : circleType,
        style : new Style({stroke : "black"}),
        drawingFunc : drawCircle,
        geom : new maths.Circle(),
        output:null,
        lastUpdated : -1
    };
}


export const circleAxialSymmetry = (c, axis) => ({
    ...baseCircle(),
    description : "circle axial symmetry",
    input : {c, axis},
    update : ({geom}) => {
        geom.copy(c.geom);
        maths.circleAxialSymmetry(geom, axis.geom);
    }
});

export const circleCentralSymmetry = (c, center) => ({
    ...baseCircle(),
    description:"circle central symmetry",
    input : {c, center},
    update : ({geom}) => {
        geom.copy(c.geom);
        maths.circleCentralSymmetry(geom, center.geom);
    }
});

export const circumCircle = (p1, p2, p3) => ({
    ...baseCircle(),
    description : "circum circle",
    input : {p1, p2, p3},
    helpers : {center : circumCenter(p1, p2, p3)},
    update : ({geom, helpers}) => {
        geom.center.copy(helpers.center.geom);
        geom.radius = maths.Vector2.dist(helpers.center.geom, p1.geom);
    }
});


export const circleFromCenterPoint = (center, point) => ({
    ...baseCircle(),
    description:"Circle from (center, point)",
    input:{center, point},
    update:({geom}) => {
        geom.center.copy(center.geom);
        geom.radius = maths.Vector2.dist(geom.center, point.geom);
    }
});


export const circleFromCenterRadius = (center, radius) => ({
    ...baseCircle(),
    description:"Circle from (center, radius)",
    input:{center, radius:scalar(radius)},
    update:({geom}) => {
        geom.center.copy(center.geom);
        geom.radius = radius.value;
    }
});


export const circle = makeDispatch(
    circumCircle,
    circleFromCenterPoint,
    circleFromCenterRadius,
)

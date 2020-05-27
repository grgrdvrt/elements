import {drawFuncGraph} from "../gui/graphics/drawing";
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
    funcType,
} from "../api/types";

export const functionGraph = (func) => ({
    type : funcType,
    style : new Style({stroke : "black"}),
    drawingFunc : drawFuncGraph,
    input:{func},
    output:null,
    lastUpdated : -1,
});

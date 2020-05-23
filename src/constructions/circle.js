import {drawCircle} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";

import {Construction} from "../api/Construction";
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
import {makeConstructor} from "../api/Construction";

export function baseCircle(){
    return {
        type : circleType,
        style : new Style({stroke : "black"}),
        drawingFunc : drawCircle,
        output : new maths.Circle(),
        lastUpdated : -1
    };
}
Construction


export const circleAxialSymmetry = (c, axis) => ({
    description : "circle axial symmetry",
    ...baseCircle(),
    input : {c, axis},
    update : (input, output) => {
        output.copy(input.c.output);
        maths.circleAxialSymmetry(output, input.axis.output);
    }
});

export const circleCentralSymmetry = (c, center) => ({
    description:"circle central symmetry",
    ...baseCircle(),
    input : {c, center},
    update : (input, output) => {
        output.copy(input.c.output);
        maths.circleCentralSymmetry(output, input.center.output);
    }
});

export const circumCircle = (p1, p2, p3) => ({
    description : "circum circle",
    input : {p1, p2, p3},
    helpers : {center : circumCenter(p1, p2, p3)},
    ...baseCircle(),
    update : (input, output, helpers) => {
        output.center.copy(helpers.center.output);
        output.radius = maths.Vector2.dist(helpers.center.output, input.p1.output);
    }
});

// export const circumCircle = makeConstructor(
//     "circum circle",
//     [pointType, pointType, pointType],
//     (p1, p2, p3) => ({
//         input:{p1, p2, p3},
//         helpers:{center:circumCenter(p1, p2, p3)},
//         output : baseCircle(),
//     }),
//     (input, output, helpers) => {
//         const center = helpers.center;
//         const circle = output.output;
//         circle.center.copy(center.output);
//         circle.radius = maths.Vector2.dist(center.output, input.p1.output);
//     }
// );



// export function circumCircle(p1, p2, p3){
//   const circle = baseCircle();
//   const center = circumCenter(p1, p2, p3);
//   Object.assign(circle, {
//     center,
//     p1, p2, p3,
//     construction : new Construction({
//       description:"circum circle",
//       input : {p1, p2, p3},
//       output : circle,
//       helpers : {center},
//       update : function(input, output, helpers){
//         const center = helpers.center;
//         const circle = output.output;
//         circle.center.copy(center.output);
//         circle.radius = maths.Vector2.dist(center.output, input.p1.output);
//       }
//     })
//   });
//   return circle;
// }

export const circleFromCenterPoint = (center, point) => ({
    description:"Circle from (center, point)",
    input:{center, point},
    ...baseCircle(),
    update:(input, output) => {
        output.center.copy(input.center.output);
        output.radius = maths.Vector2.dist(output.center, input.point.output);
    }
});


export const circleFromCenterRadius = (center, radius) => ({
    description:"Circle from (center, radius)",
    input:{
        center,
        radius:scalar(radius)
    },
    ...baseCircle(),
    update:(input, output) => {
        output.center.copy(input.center.output);
        output.radius = input.radius.value;
    }
});


export const circle = makeDispatch(
    circumCircle,
    circleFromCenterPoint,
    circleFromCenterRadius,
)

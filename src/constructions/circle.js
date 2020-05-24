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
import {makeConstructor} from "../api/Construction";

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
    description : "circle axial symmetry",
    ...baseCircle(),
    input : {c, axis},
    update : ({input, geom}) => {
        geom.copy(input.c.geom);
        maths.circleAxialSymmetry(geom, input.axis.geom);
    }
});

export const circleCentralSymmetry = (c, center) => ({
    description:"circle central symmetry",
    ...baseCircle(),
    input : {c, center},
    update : ({input, geom}) => {
        geom.copy(input.c.geom);
        maths.circleCentralSymmetry(geom, input.center.geom);
    }
});

export const circumCircle = (p1, p2, p3) => ({
    description : "circum circle",
    input : {p1, p2, p3},
    helpers : {center : circumCenter(p1, p2, p3)},
    ...baseCircle(),
    update : ({input, geom, helpers}) => {
        geom.center.copy(helpers.center.geom);
        geom.radius = maths.Vector2.dist(helpers.center.geom, input.p1.geom);
    }
});

// export const circumCircle = makeConstructor(
//     "circum circle",
//     [pointType, pointType, pointType],
//     (p1, p2, p3) => ({
//         input:{p1, p2, p3},
//         helpers:{center:circumCenter(p1, p2, p3)},
//         geom : baseCircle(),
//     }),
//     (input, geom, helpers) => {
//         const center = helpers.center;
//         const circle = geom.geom;
//         circle.center.copy(center.geom);
//         circle.radius = maths.Vector2.dist(center.geom, input.p1.geom);
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
//       geom : circle,
//       helpers : {center},
//       update : function(input, geom, helpers){
//         const center = helpers.center;
//         const circle = geom.geom;
//         circle.center.copy(center.geom);
//         circle.radius = maths.Vector2.dist(center.geom, input.p1.geom);
//       }
//     })
//   });
//   return circle;
// }

export const circleFromCenterPoint = (center, point) => ({
    description:"Circle from (center, point)",
    input:{center, point},
    ...baseCircle(),
    update:(input, geom) => {
        geom.center.copy(input.center.geom);
        geom.radius = maths.Vector2.dist(geom.center, input.point.geom);
    }
});


export const circleFromCenterRadius = (center, radius) => ({
    description:"Circle from (center, radius)",
    input:{
        center,
        radius:scalar(radius)
    },
    ...baseCircle(),
    update:(input, geom) => {
        geom.center.copy(input.center.geom);
        geom.radius = input.radius.value;
    }
});


export const circle = makeDispatch(
    circumCircle,
    circleFromCenterPoint,
    circleFromCenterRadius,
)

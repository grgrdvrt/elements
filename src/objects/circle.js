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


import {makeConstructor, makeDispatch} from "../api/types";

export function baseCircle(){
  return {
    type:circleType,
    style : new Style({stroke:"black"}),
    drawingFunc : drawCircle,
    geom:new maths.Circle()
  };
}

// export function circle(...args){
//   if(args.length === 3){
//     return circumCircle(...args);
//   }
//   else if(args[1].type === pointType){
//     return circleFromCenterPoint(...args);
//   }
//   else if(args[1].type !== scalarType){
//     return circleFromCenterRadius(args[0], scalar(args[1]));
//   }
//   else {
//     return circleFromCenterRadius(args[0], args[1]);
//   }
// }

// export function circleFromCenterPoint(center, point){
//   const circle = baseCircle();
//   Object.assign(circle, {
//     center,
//     construction : new Construction({
//       description:"Circle from (center, point)",
//       input:{center, point},
//       output:circle,
//       update : function(input, output) {
//         const c = output.geom;
//         c.center.copy(input.center.geom);
//         c.radius = maths.Vector2.dist(c.center, input.point.geom);
//       }
//     })
//   });
//   return circle;
// }


// export function circleFromCenterRadius(center, radius){
//   const circle = baseCircle();
//   radius = scalar(radius);
//   Object.assign(circle, {
//     center, radius,
//     construction : new Construction({
//       description:"Circle from (center, radius)",
//       input : {center, radius},
//       output : circle,
//       update : function(input, output){
//         const c = output.geom;
//         c.center.copy(input.center.geom);
//         c.radius = input.radius.value;
//       }
//     })
//   });
//   return circle;
// }


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
//         const circle = output.geom;
//         circle.center.copy(center.geom);
//         circle.radius = maths.Vector2.dist(center.geom, input.p1.geom);
//       }
//     })
//   });
//   return circle;
// }

export function circleAxialSymmetry(c, axis){
  const circle = baseCircle();
  Object.assign(circle, {
    construction : new Construction({
      description:"circle axial symmetry",
      input : {c, axis},
      output : circle,
      update : function(input, output){
        output.geom.copy(input.c.geom);
        maths.circleAxialSymmetry(output.geom, input.axis.geom);
      }
    })
  });
  return circle;
}

export function circleCentralSymmetry(c, center){
  const circle = baseCircle();
  Object.assign(circle, {
    construction : new Construction({
      description:"circle central symmetry",
      input : {c, center},
      output : circle,
      update : function(input, output){
        output.geom.copy(input.c.geom);
        maths.circleCentralSymmetry(output.geom, input.center.geom);
      }
    })
  });
  return circle;
}


export const circumCircle = makeConstructor(
    "circum circle",
    [pointType, pointType, pointType],
    (p1, p2, p3) => ({
        input:{p1, p2, p3},
        helpers:{center:circumCenter(p1, p2, p3)},
        output : baseCircle(),
    }),
    (input, output, helpers) => {
        const center = helpers.center;
        const circle = output.geom;
        circle.center.copy(center.geom);
        circle.radius = maths.Vector2.dist(center.geom, input.p1.geom);
    }
)

export const circleFromCenterPoint = makeConstructor(
    "Circle from (center, point)",
    [pointType, pointType],
    (center, point) => ({
        input:{center, point},
        output : baseCircle(),
    }),
    (input, output) => {
        const c = output.geom;
        c.center.copy(input.center.geom);
        c.radius = maths.Vector2.dist(c.center, input.point.geom);
    }
)


export const circleFromCenterRadius = makeConstructor(
    "Circle from (center, radius)",
    [pointType, scalarType],
    (center, radius) => ({
        input:{
            center,
            radius:scalar(radius)
        },
        output : baseCircle(),
    }),
    (input, output) => {
        const c = output.geom;
        c.center.copy(input.center.geom);
        c.radius = input.radius.value;
    }
)

// export const circleFromCenterRadius = makeConstructor(
//     [pointType, scalarType],
//     (center, radius) => {
//         return new Construction({
//             description: "Circle from (center, radius)",
//             input:{
//                 center,
//                 radius:scalar(radius)
//             },
//             output : baseCircle(),
//             update:(input, output) => {
//                 const c = output.geom;
//                 c.center.copy(input.center.geom);
//                 c.radius = input.radius.value;
//             }
//         })
//     },
// )


export const circle = makeDispatch(
    circumCircle,
    circleFromCenterPoint,
    circleFromCenterRadius,
)

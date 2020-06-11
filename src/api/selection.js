import * as point from "../constructions/point";
import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,
} from "../api/types";
import * as maths from "../maths";


export function selectInCircle(objects, circle){
  const result = [];
  objects.forEach(object => {
    if(object.selectable === false){
      return;
    }
    if(Array.isArray(object)){
      result.push(...selectInCircle(object, circle));
    }
    else {
      let distance;
      switch(object.type){
        case pointType:
            distance = maths.pointsDistance(circle.center, object.geom);
            break;
        case lineType:
            distance = maths.pointLineDistance(circle.center, object.geom);
            break;
        case circleType:
            distance = maths.pointCircleDistance(circle.center, object.geom);
            break;
        default:
            console.warn("type not handled : " + object.type);
            return;
            break;
      }
      result.push({object, distance});
    }
  });
  return result.filter(o => Math.abs(o.distance) < circle.radius);
}

import * as point from "../objects/point";
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
            distance = maths.vectorsDistance(object.geom, circle.center);
            break;
        case lineType:
            distance = maths.vectorLineDistance(circle.center, object.geom);
            break;
        case circleType:
            distance = maths.vectorCircleDistance(circle.center, object.geom);
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

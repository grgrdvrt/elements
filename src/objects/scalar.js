import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,
} from "../api/types";

export function scalar(value){
  return {
    type:scalarType,
    value:value.type === scalarType ? value.value : value
  };
}

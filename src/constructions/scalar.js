import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,
} from "../api/types";

let id = 0;
export function scalar(value){
    return {
        type : scalarType,
        name : `Scalar_${id++}`,
        value : value.type === scalarType ? value.value : value,
        valueOf(){return this.value;}
    };
}

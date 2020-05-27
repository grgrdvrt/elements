import {drawLine} from "../gui/graphics/drawing";
import Style from "../gui/graphics/Style";
import * as maths from "../maths";

import {scalar} from "./scalar";
import {point, pointOnPerpendicular} from "./point";


import {
    circleType,
    lineType,
    pointType,
    polygonType,
    scalarType,
    segmentType,
    vectorType,

    makeTypedFunction,
} from "../api/types";

let id = 0;
export function baseLine(){
    return {
        type:lineType,
        name : `Line_${id++}`,
        style : new Style({stroke:"black"}),
        drawingFunc : drawLine,
        output:null,
        geom:new maths.Line(),
        lastUpdated:-1,
    };
}


export const lineFromPoints = makeTypedFunction(
    [pointType, pointType],
    (p1, p2) => ({
        ...baseLine(),
        description:"line from points",
        input:{p1, p2},
        update({geom}){
            geom.point.copy(p1.geom);
            geom.vector.copy(p2.geom).sub(p1.geom);
        }
    })
);



export const lineFromPointVector = makeTypedFunction(
    [pointType, vectorType],
    (point, vector) => ({
        description:"line from (point, vector)",
        ...baseLine(),
        input:{point, vector},
        update({geom}){
            geom.set(point.geom, vector.geom);
        }
    })
);



export const perpendicular = makeTypedFunction(
    [lineType, pointType],
    (line, point) => {
        return {
            ...baseLine(),
            description:"line from (point, vector)",
            input:{line, point},
            update({geom}){
                geom.point.copy(point.geom);
                const lv = line.geom.vector;
                geom.vector.set(-lv.y, lv.x);
            }
        };
    }
);


export const segmentBissector = makeTypedFunction(
    [segmentType],
    segment => ({
        description:"segment bissector",
        ...baseLine(),
        input:{segment},
        update({geom}){
            const p1 = segment.geom.p1;
            const p2 = segment.geom.p2;
            geom.point.lerp(p1, p2, 0.5);
            geom.vector.set(p1.y - p2.y, p2.x - p1.x);
        }
    })
);
export const bissectorPointPoint = makeTypedFunction(
    [pointType, pointType],
    (p1, p2) => ({
        description:"bissector point point",
        ...baseLine(),
        input:{p1, p2},
        update({geom}){
            geom.point.lerp(p1.geom, p2.geom, 0.5);
            geom.vector.set(p1.geom.y - p2.geom.y, p2.geom.x - p1.geom.x);
        }
    })
);


export const angleBissector = makeTypedFunction(
    [pointType, pointType, pointType],
    (p1, p2, p3) => {
        const tmp = new maths.Vector2();
        return {
            description:"angle bissector",
            ...baseLine(),
            input:{p1, p2, p3},
            update({input, geom}){
                const p1 = input.p1.geom;
                const p2 = input.p2.geom;
                const p3 = input.p3.geom;
                const len = maths.Vector2.dist(p2, p3);
                tmp.copy(p1).sub(p2).setLength(len).add(p2);
                tmp.lerp(tmp, p3, 0.5);

                geom.point.copy(p2);
                geom.vector.copy(tmp).sub(p2).normalize();
            }
        };
    }
);



/** transforms **/

export const lineCentralSymmetry = makeTypedFunction(
    [lineType, pointType],
    (line, center) => ({
        ...baseLine(),
        description:"line central symmetry",
        input:{line, center},
        update({geom}){
            maths.lineCentralSymmetry(geom.copy(line.geom), center);
        }
    })
);

export const lineAxialSymmetry = makeTypedFunction(
    [lineType, lineType],
    (line, axis) => ({
        ...baseLine(),
        description:"line axial symmetry",
        input:{line, axis},
        update({geom}){
            maths.lineAxialSymmetry(geom.copy(line.geom), axis);
        }
    })
);

export const lineTranslation = makeTypedFunction(
    [lineType, vectorType],
    (line, vector) => ({
        ...baseLine(),
        description:"line translation",
        input:{line, vector},
        update({geom}){
            geom.copy(line.geom);
            geom.point.sub(vector.geom.p1)
                .add(vector.geom.p2);
        }
    })
);

export const lineRotation = makeTypedFunction(
    [lineType, pointType, scalarType],
    (line, center, angle) => ({
        ...baseLine(),
        description:"line rotation",
        input:{line, center, angle},
        update({geom}){
            maths.lineRotation(geom.copy(line.geom), center.geom, angle);
        }
    })
);


export const lineHomothecy = makeTypedFunction(
    [lineType, pointType, scalarType],
    (line, center, scale) => ({
        ...baseLine(),
        description:"line homotecy",
        input:{line, center, scale},
        update({geom}){
            maths.lineHomothecy(geom.copy(line.geom), center.geom, scale);
        }
    })
);

export function line(a, b){
    if(a.type === pointType && b.type === pointType){
        return lineFromPoints(a, b);
    }
    else if(a.type === pointType && b.type === vectorType){
        return lineFromPointVector();
    }

    if(!Number.isNaN(a)){
        a = scalar(a);
    }
    if(!Number.isNaN(b)){
        b = scalar(b);
    }

    if(a.type === pointType && b.type === scalarType){
        throw new Error("not implemented yet");
    }
    else if(a.type === vectorType && b.type === scalarType){
        throw new Error("not implemented yet");
    }
    else if(a.type === scalarType && b.type === scalarType){
        throw new Error("not implemented yet");
    }
    else {
        throw new Error("no line constructor for given params : " + a + ", " + b);
    }
}

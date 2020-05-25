export const circleType = "circle";
export const lineType = "line";
export const pointType = "point";
export const polygonType = "polygon";
export const scalarType = "scalar";
export const segmentType = "segment";
export const vectorType = "vector";
// export const listType = type => `list(${type})`;
export const listType = type => `list`;

export function makeTypedFunction(types, func){
    const typedFunc = (...args) => func(...spreadTypedArgs(args, types));
    typedFunc.types = types;
    typedFunc.baseFunc = func;
    return typedFunc;
}

function matchType(type, value){
    return (type === scalarType && value) ||
        (type === listType() && Array.isArray(value)) ||
        value.type === type;
}

function spreadTypedArgs(args, types){
    const params = Array.from(args);
    const result = [];
    if(types.length !== params.length){
        return undefined;
    }
    for(let type of types){
        let nextParam = undefined;
        for(let i = 0; i < params.length; i++){
            const param = params[i];
            if(matchType(type, param)){
                nextParam = param;
                params.splice(i, 1);
                break;
            }
        }
        if(nextParam === undefined){
            return undefined;
        }
        else{
            result.push(nextParam);
        }
    }
    return result;
}

export function makeDispatch(...funcs){
    return (...args) => {
        let spreadParams = undefined;
        let func = undefined;
        for(let candidate of funcs){
            spreadParams = spreadTypedArgs(args, candidate.types);
            if(spreadParams){
                func = candidate;
                break;
            }
        }
        if(func){
            return func.baseFunc(...spreadParams);
        }
        else{
            console.error(`no match found for args ${args}`);
            return undefined;
        }
    };
}


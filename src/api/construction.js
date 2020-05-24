import {initTypes} from "./types";

function updateObject(object, timeStamp){
    if(object.lastUpdated >= timeStamp){
        return;
    }
    if(Array.isArray(object)){
        object.forEach(obj => updateObject(obj, timeStamp));
    }
    else if(object.construction !== undefined){
        for(let helper of object.helpers){
            updateObject(helper, timeStamp);
        }
        for(let input of object.inputs){
            updateObject(input, timeStamp);
        }
        object.update(object.input, object.output, object.helpers, timeStamp);
        object.lastUpdated = timeStamp;
    }
}

export function makeConstructor(description, types, init, update){
    const spreadTypes = initTypes(types)
    const constructor = function(...args){
        const objects = init(...spreadTypes(args))
        Object.assign(objects.output, {
            ...objects.input,
            construction:new Construction({
                description,
                ...objects,
                update:update
            })
        })
        return objects.output;
    }
    constructor.types = types;
    constructor.spreadTypes = spreadTypes;
    return constructor;
}

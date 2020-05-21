import {initTypes} from "./types";

export function updateObjects(objects, timeStamp){
    for(let k in objects){
        const obj = objects[k];
        if(Array.isArray(obj)){
            obj.forEach(obj => updateObjects(obj, timeStamp));
        }
        else if(obj.construction !== undefined){
            obj.construction.update(timeStamp);
        }
    }
}

export class Construction{
    constructor(params){
        this.description = params.description;
        this.input = params.input;
        this.output = params.output;
        this.helpers = params.helpers;
        this.updateFunction = params.update;

        this.timeStamp = -1;
        this.update();
    }

    update(timeStamp){
        if(timeStamp === this.timeStamp){
            return;
        }
        this.timeStamp = timeStamp;

        updateObjects(this.input, timeStamp);
        updateObjects(this.helpers, timeStamp);
        this.updateFunction(this.input, this.output, this.helpers, timeStamp);
    }
}

export const defaultConstruction = new Construction({
    input:{},
    output:{},
    description:"free construction",
    update: function(input, output){}
});


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

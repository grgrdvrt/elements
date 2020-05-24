import {initTypes} from "./types";

function updateObject(object, timeStamp){
    if(object.lastUpdated >= timeStamp){
        return;
    }
    for(let input of object.inputs){
        updateObject(input, timeStamp);
    }
    for(let helper of object.helpers){
        updateObject(helper, timeStamp);
    }
    object.update(object, timeStamp);
    object.lastUpdated = timeStamp;
}
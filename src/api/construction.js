export function updateObject(object, timeStamp){
    if(object.lastUpdated >= timeStamp){
        return;
    }
    if(object.input){
        for(let key in object.input){
            updateObject(object.input[key], timeStamp);
        }
    }
    if(object.helpers){
        for(let key in object.helpers){
            updateObject(object.helpers[key], timeStamp);
        }
    }
    if(object.update){
        object.update(object, timeStamp);
    }
    object.lastUpdated = timeStamp;
}

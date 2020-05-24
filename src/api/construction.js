export function updateObject(object, timeStamp){
    if(object.lastUpdated >= timeStamp){
        return;
    }
    if(object.input){
        for(let name in object.input){
            updateObject(object.input[name], timeStamp);
        }
    }
    if(object.helpers){
        for(let name in object.helpers){
            updateObject(object.helpers[name], timeStamp);
        }
    }
    if(object.update){
        object.update(object, timeStamp);
    }
    object.lastUpdated = timeStamp;
}

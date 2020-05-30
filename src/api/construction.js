export function updateObject(object, timeStamp){
    if(object.lastUpdated >= timeStamp){
        return;
    }
    let isValid = true;
    if(object.input){
        for(let key in object.input){
            const input = object.input[key];
            updateObject(input, timeStamp);
            isValid = input.isValid && isValid;
        }
    }
    if(object.helpers){
        for(let key in object.helpers){
            updateObject(object.helpers[key], timeStamp);
        }
    }
    if(object.update && isValid){
        const updateResponse = object.update(object, timeStamp);
        isValid = updateResponse !== false;
    }
    object.isValid = isValid;
    object.lastUpdated = timeStamp;
}

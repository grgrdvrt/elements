export function updateObject(object, timeStamp){
    if(object.lastUpdated >= timeStamp){
        return;
    }
    if(object.input){
          updateObjects(object.input, timeStamp);
    }
    if(object.helpers){
       updateObjects(object.helpers, timeStamp);
    }
    if(object.update){
        object.update(object, timeStamp);
    }
    object.lastUpdated = timeStamp;
}

export function updateObjects(objects, timeStamp){
  if(Array.isArray(objects)){
    objects.forEach(o => updateObjects(o, timeStamp));
  }
  else if(objects.update){
    updateObject(objects, timeStamp);
  }
  else{
    for(let key in objects){
      updateObjects(objects[key], timestamp);
    }
  }
}
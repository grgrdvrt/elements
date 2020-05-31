import * as api from "../../api";
import * as maths from "../../maths";

import Signal from "../../utils/Signal";


//WIP
function getIntersections(objs){
    const nObjs = objs.length;
    const intersections = [];
    for(let i = 0; i < nObjs; i++){
        const o1 = objs[i];
        for(let j = i + 1; j < nObjs; j++){
            const o2 = objs[j];
            const inter = api.intersection(o1, o2);
            if(Array.isArray(inter)){
                intersections.push(...inter);
            }
            else{
                intersections.push(inter);
            }
        }
    }
    return intersections;
}

function getClosest(items){
    let result = undefined;
    let minDist = Number.POSITIVE_INFINITY;
    for(let item of items){
        if(item.distance < minDist){
            result = item;
            minDist = item.distance;
        }
    }
    return result;
}

export class SelectObjectOrCreatePoint{
    constructor(stage, mouse, types){
        this.stage = stage;
        this.mouse = mouse;
        this.types = types;
        this.selectionCircle = new maths.Circle(undefined, 5);
        this.completed = new Signal();
    }

    enable(){
        this.mouse.onUp.add(this.onClick, this);
    }

    disable(){
        this.mouse.onUp.remove(this.onClick, this);
    }

    onClick(){
        this.selectionCircle.center.copy(this.mouse);
        this.selectionCircle.radius = 10 / Math.abs(this.stage.scale.x);

        const selection = api.selectInCircle(this.stage.items, this.selectionCircle);
        const pointRequested = this.types.indexOf(api.pointType) !== -1;
        this.pointCreated = false;
        if(selection.length === 0){
            if(pointRequested){
                this.object = api.point(this.selectionCircle.center.x, this.selectionCircle.center.y);
                this.pointCreated = true;
            }
            else{
                this.object = null;
            }
        }
        else {
            if(pointRequested){
                const pointsInSelection = selection.filter(item => item.object.type === api.pointType);
                if(pointsInSelection.length > 0){
                    this.object = getClosest(pointsInSelection).object;
                }
                else{
                    const objects = selection.filter(item => this.types.indexOf(item.object.type) !== -1);
                    if(objects.length === 0){
                        const intersections = getIntersections(selection.map(o => o.object));
                        if(intersections.length === 0){
                            const closestObject = getClosest(selection).object;
                            this.object = api.pointOnObject(closestObject, this.selectionCircle.center);
                            this.pointCreated = true;
                        }
                        else{
                            this.object = getClosest(intersections.filter(inter => {
                                return inter.update(inter) !== false;
                            }).map(inter => ({
                                distance:maths.Vector2.dist(this.selectionCircle.center, inter.geom),
                                object:inter
                            }))).object;
                            this.pointCreated = true;
                        }
                    }
                    else{
                        objects.sort((a, b) => Math.abs(b.distance) - Math.abs(a.distance));
                        this.object = selection[0].object;
                    }
                }
            }
            else{
                const objects = selection.filter(item => this.types.indexOf(item.object.type) !== -1);
                if(objects.length === 0){
                    this.object = null;
                }
                else{
                    objects.sort((a, b) => Math.abs(b.distance) - Math.abs(a.distance));
                    this.object = selection[0].object;
                }
            }
       }

        if(this.pointCreated){
            this.stage.add(this.object);
        }
        this.completed.dispatch(this.object, this.pointCreated);

    }

    cancel(){
        
    }

    undo(){
        if(this.pointCreated){
            this.stage.remove(this.object);
        }
    }

    redo(){
        if(this.pointCreated){
            this.stage.add(this.object);
        }
    }
}

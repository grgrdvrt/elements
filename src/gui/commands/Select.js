import * as api from "../../api";
import * as maths from "../../maths";

import Signal from "../../utils/Signal";


//WIP
function getClosestIntersection(objs){
    const nObjs = objs.length;
    const minDist = Number.POSITIVE_INFINITY;
    const selectedIntersection = undefined;
    for(let i = 0; i < nObjs; i++){
        const o1 = objs[i];
        for(let j = i + 1; j < nObjs; j++){
            const o2 = objs[i];
            const inter = api.intersection(o1, o2);
            inter.update(inter);
            if(inter.isValid){

            }
        }
    }
    return selectedIntersection;
}

export class SelectObjectOrCreatePoint{
    constructor(stage, mouse){
        this.stage = stage;
        this.mouse = mouse;
        this.selectionCircle = new maths.Circle(undefined, 5);
        this.completed = new Signal();
    }

    enable(){
        this.mouse.onUp.add(this.onClick, this);
    }

    disable(){
        this.mouse.onUp.remove(this.onClick, this);
    }

    setTypes(types){
        this.types = types;
    }

    onClick(){
        this.selectionCircle.center.copy(this.mouse);
        this.selectionCircle.radius = 10 / Math.abs(this.stage.scale.x);

        let selection = api.selectInCircle(this.stage.items, this.selectionCircle).filter(item => {
            return this.types.indexof(item) !== -1;
        });
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
                    pointsInSelection.sort((a, b) => Math.abs(b.distance) - Math.abs(a.distance));
                    this.object = pointsInSelection[0].object;
                }
                else{
                    const objects = selection.filter(item => this.types.indexOf(item.object.type) !== -1);
                    if(objects.length === 0){
                        const intersections = getIntersections(selection.map(o => o.object));
                        if(intersections.length === 0){
                            const closestObject = pointsInSelection[0].object;
                            this.object = api.pointOnObject(closestObject, this.selectionCircle.center);
                        }
                        else{
                            //sort intersections
                            this.object = null;
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

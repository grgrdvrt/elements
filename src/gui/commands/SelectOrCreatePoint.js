import * as api from "../../api";
import * as maths from "../../maths";

import Signal from "../../utils/Signal";

export class SelectOrCreatePoint{
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

    onClick(){
        this.selectionCircle.center.copy(this.mouse);
        this.selectionCircle.radius = 10 / Math.abs(this.stage.scale.x);

        let selection = api.selectInCircle(this.stage.items, this.selectionCircle);
        if(selection.length === 0){
            this.point = api.point(this.selectionCircle.center.x, this.selectionCircle.center.y);
            this.pointCreated = true;
        }
        else {
            const points = selection.filter(item => item.object.type === api.pointType);
            if(points.length > 0){
                selection = points;
            }

            selection.sort((a, b) => Math.abs(b.distance) - Math.abs(a.distance));
            const closestObject = selection[0].object;
            this.point = api.pointOnObject(closestObject, this.selectionCircle.center);
            this.pointCreated = closestObject.type !== api.pointType;
        }

        if(this.pointCreated){
            this.stage.add(this.point);
        }
        this.completed.dispatch(this.point);
    }

    cancel(){
        
    }

    undo(){
        if(this.pointCreated){
            this.stage.remove(this.point);
        }
    }

    redo(){
        if(this.pointCreated){
            this.stage.add(this.point);
        }
    }
}

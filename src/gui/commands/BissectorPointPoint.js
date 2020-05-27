import Signal from "../../utils/Signal";
import {SelectOrCreatePoint} from "./SelectOrCreatePoint";
import * as api from "../../api";

export class BissectorPointPoint{
    constructor(stage, mouse){
        this.completed = new Signal();
        this.stage = stage;
        this.mouse = mouse;
    }

    enable(){
        this.p1Command = new SelectOrCreatePoint(this.stage, this.mouse);
        this.p1Command.enable();
        this.p1Command.completed.add(this.onP1, this);
        this.pointCommand = this.p1Command;
    }

    disable(){
        this.p1Command.completed.remove(this.onP1, this);
        if(this.p2Command){
            this.p2Command.completed.remove(this.onP2, this);
        }
        this.pointCommand.disable();
    }

    onP1(p1){
        this.p1 = p1;
        this.tempP2 = api.mouse(this.stage, this.mouse);
        this.tempBissector = api.bissectorPointPoint(this.p1, this.tempP2);
        this.tempBissector.selectable = false;
        this.p1.selectable = false;
        this.tempP2.selectable = false;
        this.stage.add(this.tempBissector);
        this.stage.add(this.tempP2);

        this.p1Command.completed.remove(this.onP1, this);
        this.p1Command.disable();

        this.p2Command = new SelectOrCreatePoint(this.stage, this.mouse);
        this.p2Command.enable();
        this.p2Command.completed.add(this.onP2, this);
        this.pointCommand = this.p2Command;
    }

    onP2(p2){
        this.p2 = p2;

        this.p2Command.completed.remove(this.onP2, this);
        this.p2Command.disable();

        this.stage.remove(this.tempP2);
        this.stage.remove(this.tempBissector);

        this.bissector = api.bissectorPointPoint(this.p1, this.p2);
        this.stage.add(this.bissector);
        this.p1.selectable = true;
        this.p2.selectable = true;

        this.completed.dispatch(this.bissector);
    }

    cancel(){
        if(this.p1){
            this.p1Command.undo();
            this.stage.remove(this.tempBissector);
            this.p2Command.completed.remove(this.onP1, this);
            this.p2Command.disable();
        }
    }

    undo(){
        this.p1Command.undo();
        this.p2Command.undo();
        this.stage.remove(this.bissector);
    }

    redo(){
        this.p1Command.redo();
        this.p2Command.redo();
        this.stage.add(this.bissector);
    }
}

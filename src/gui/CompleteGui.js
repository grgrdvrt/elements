import * as maths from "../maths";
import * as api from "../api";
import {Stage} from "./Stage";
import Mouse from "./Mouse";

import * as commands from "./commands";

import {Tool} from "./Tool";
import ToolsSelector from "./ToolsSelector";

export default class CompleteGui{
    constructor(props){
        props = Object.assign({
            updateCallback:() => {},
            width:700,
            height:700,
            autoStart:true,
            autoSize:true
        }, props);

        if(props.canvas === undefined){
            this.canvas = document.createElement("canvas");
            this.canvas.width = props.width;
            this.canvas.height = props.height;
        }
        else {
            this.canvas = props.canvas;
        }

        this.updateCallback = props.updateCallback;

        this.window = maths.Rectangle.makeArea(-1.2, 1.2, 1.2, -1.2);
        this.stage = new Stage(this.canvas, {window:this.window.clone()});

        this.mouseController = new Mouse(this.stage);

        let selector = new ToolsSelector([
            new Tool(this.stage, this.mouseController, commands.DragPoint, "drag point", "icon"),
            new Tool(this.stage, this.mouseController, commands.LinePointPoint, "create line", "icon"),
            new Tool(this.stage, this.mouseController, commands.SegmentPointPoint, "create segment", "icon"),
            new Tool(this.stage, this.mouseController, commands.BissectorPointPoint, "create bissector", "icon"),
            new Tool(this.stage, this.mouseController, commands.CircleCenterPoint, "create circle", "icon"),
            new Tool(this.stage, this.mouseController, commands.DragStage, "drag", "icon")
        ]);
        selector.buildList();
        selector.enable();

        this.domElement = document.createElement("div");
        this.domElement.appendChild(this.canvas);
        this.domElement.appendChild(selector.domElement);

        if(props.autoStart){
            this.start();
        }
        if(props.autoSize){
            this.autoSize();
            window.onload = () => {
                this.onAutoSize();
                window.onload = null;
            };
        }
    }

    randPt(){
        return api.randomPoint(this.stage.window);
    }

    start(){
        if(this.isPlaying){
            return;
        }
        this.isPlaying = true;
        this.update();
    }

    pause(){
        this.isPlaying = false;
    }

    update(){
        let timeStamp = Date.now();
        this.updateCallback(timeStamp);
        let w = this.stage.window;
        this.stage.clear();
        this.stage.draw(timeStamp);
        if(this.isPlaying){
            requestAnimationFrame(this.update.bind(this));
        }
    }

    autoSize(){
        let ds = this.domElement.style;
        let cs = this.canvas.style;
        cs.width = ds.width = "100%";
        cs.height = ds.height = "100%";
        window.addEventListener("resize", () => this.onAutoSize());
    }

    onAutoSize(){
        this.resize(
            this.domElement.clientWidth,
            this.domElement.clientHeight
        );
    }

    resize(w, h){
        this.canvas.width = w;
        this.canvas.height = h;
        const stageRatio = w / h;
        const windowRatio = Math.abs(this.window.width / this.window.height);
        this.stage.window.copy(this.window);
        let vw, vh;
        if(stageRatio > windowRatio){
            vw = this.window.width * stageRatio / windowRatio;
            vh = this.window.height;
        }
        else{
            vw = this.window.width;
            vh = this.window.height / (stageRatio / windowRatio);
        }
        this.stage.window.set(
            this.window.x + 0.5 * this.window.width - 0.5 * vw,
            this.window.y + 0.5 * this.window.height - 0.5 * vh,
            vw,
            vh
        );
    }
}

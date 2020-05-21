import MouseInput from "../utils/Mouse";
import {Vector2} from "../maths";

export default class Mouse{
  constructor(stage){
    this.stage = stage;
    this.mouseInput = new MouseInput(this.stage.canvas);

    let mi = this.mouseInput;
    this.onDown = mi.onDown;
    this.onUp = mi.onUp;
    this.onDrag = mi.onDrag;

    this.onMiddleDown = mi.onMiddleDown;
    this.onMiddleDrag = mi.onMiddleDrag;
    this.onMiddleUp = mi.onMiddleUp;

    this.onRightDown = mi.onRightDown;
    this.onRightDrag = mi.onRightDrag;
    this.onRightUp = mi.onRightUp;

    this.onMove = mi.onMove;
    this.onWheel = mi.onWheel;

    this.position = new Vector2();
    this.enable();
  }

    enable(){
        this.onMove.add(this.updatePosition, this);
    }

    disable(){
        this.onMove.remove(this.updatePosition, this);
    }

    updatePosition(){
        this.stage.domToWindowCoords(this.position.copy(this.mouseInput));
    }


    get x (){return this.position.x;}
    get y (){return this.position.y;}

}

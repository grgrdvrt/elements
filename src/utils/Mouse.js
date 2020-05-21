import Signal from "../utils/Signal";

function getNumericStyleProperty(style, prop) {
  return parseInt(style.getPropertyValue(prop), 10);
}

function elementPosition(e) {
  var x = 0, y = 0;
  var inner = true ;
  do {
    x += e.offsetLeft;
    y += e.offsetTop;
    var style = window.getComputedStyle(e,null) ;
    var borderTop = getNumericStyleProperty(style,"border-top-width") ;
    var borderLeft = getNumericStyleProperty(style,"border-left-width") ;
    y += borderTop ;
    x += borderLeft ;
    if (inner) {
      var paddingTop = getNumericStyleProperty(style,"padding-top") ;
      var paddingLeft = getNumericStyleProperty(style,"padding-left") ;
      y += paddingTop ;
      x += paddingLeft ;
    }
    inner = false ;
  } while (Boolean(e = e.offsetParent));
  return { x: x, y: y };
}

export default class Mouse {
  constructor(target) {
    this.x = this.y = 0;
    this.isDown = false;
    this.isRightDown = false;
    this.target = target || document;

    this.onDown = new Signal();
    this.onUp = new Signal();
    this.onDrag = new Signal();

    this.onMiddleDown = new Signal();
    this.onMiddleDrag = new Signal();
    this.onMiddleUp = new Signal();

    this.onRightDown = new Signal();
    this.onRightDrag = new Signal();
    this.onRightUp = new Signal();

    this.onMove = new Signal();
    this.onWheel = new Signal();

    this._moveBind = this._onMouseMove.bind(this);
    this._downBind = this._onMouseDown.bind(this);
    this._upBind = this._onMouseUp.bind(this);
    this._wheelBind = this._onMouseWheel.bind(this);
    this._contextBind = (e) => {e.preventDefault(); return false;};
    this._enabled = false;
    this.enable();
  }

  enable() {
    if(this._enabled){
      return;
    }
    this.target.addEventListener("mousemove", this._moveBind);
    this.target.addEventListener("mousedown", this._downBind);
    this.target.addEventListener("mouseup", this._upBind);
    this.target.addEventListener("mousewheel", this._wheelBind);
    this.target.addEventListener("DOMMouseScroll", this._wheelBind);
    this.target.addEventListener("contextmenu", this._contextBind);
    this._enabled = true;
  }

  disable() {
    this.target.removeEventListener("mousemove", this._moveBind);
    this.target.removeEventListener("mousedown", this._downBind);
    this.target.removeEventListener("mouseup", this._upBind);
    this.target.removeEventListener("mousewheel", this._wheelBind);
    this.target.removeEventListener("DOMMouseScroll", this._wheelBind);
    this.target.removeEventListener("contextmenu", this._contextBind);
    this._enabled = false;
  }

  _onMouseMove(e) {
    var p = elementPosition(this.target);
    this.x = e.pageX - p.x;
    this.y = e.pageY - p.y;
    this.onMove.dispatch();
    if(this.isDown){
      this.onDrag.dispatch();
    }
    if(this.isMiddleDown){
      this.onMiddleDrag.dispatch();
    }
    if(this.isRightDown){
      this.onRightDrag.dispatch();
    }
  }

  _onMouseDown(e) {
    switch(e.which){
      case 1:
        this.isDown = true;
        this.onDown.dispatch();
        break;
      case 2:
        this.isMiddleDown = true;
        this.onMiddleDown.dispatch();
        break;
      case 3:
        this.isRightDown = true;
        this.onRightDown.dispatch();
        break;
    }
    return false;
  }

  _onMouseUp(e) {
    switch(e.which){
      case 1:
        this.isDown = false;
        this.onUp.dispatch();
        break;
      case 2:
        this.isMiddleDown = false;
        this.onMiddleUp.dispatch();
        break;
      case 3:
        this.isRightDown = false;
        this.onRightUp.dispatch();
        break;
    }
    return false;
  }

  _onMouseWheel(event) {
    let delta = 0;
		if ( event.wheelDelta !== undefined ) {
			delta = event.wheelDelta;
		} else if ( event.detail !== undefined ) {
			delta = - event.detail;
		}
    this.onWheel.dispatch(delta);
  }

  point(pt) {
    pt = pt || {};
    pt.x = this.x;
    pt.y = this.y;
    return pt;
  }

  setCursor(type = "default") {
    this.target.style.cursor = type;
  }

  dispose() {
    this.onDown.dispose();
    this.onUp.dispose();
    this.onMove.dispose();

    this.onMiddleDown.dispose();
    this.onMiddleUp.dispose();
    this.onMiddleMove.dispose();

    this.onRightDown.dispose();
    this.onRightUp.dispose();
    this.onRightMove.dispose();

    this.disable();
  }
}

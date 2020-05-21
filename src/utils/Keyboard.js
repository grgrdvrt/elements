import Signal from "../utils/Signal";

export default class Keyboard {
  constructor(target) {
    this.target = target || document;
    this._keys = {};
    this._preventDefaultKeys = [];
    this.onDown = new Signal();
    this.onUp = new Signal();
    this._downBind = this._onKeyDown.bind(this);
    this._upBind = this._onKeyUp.bind(this);
    this.target.addEventListener("keydown", this._downBind);
    this.target.addEventListener("keyup", this._upBind);
  }

  _onKeyDown(e) {
    e = e || window.event;
    this._doPreventDefault(e);
    if(this._keys[e.keyCode]){
      return;
    }
    this._keys[e.keyCode] = true;
    this._call(this.onDown, e.keyCode);
  }

  _onKeyUp(e) {
    e = e || window.event;
    this._doPreventDefault(e);
    this._keys[e.keyCode] = false;
    this._call(this.onUp, e.keyCode);
  }

  _call(signal, keyCode) {
    var listeners = signal.listeners;
    var i = listeners.length;
    while(i--)
    {
      var listener = listeners[i];
      if(listener === undefined || listener.executed){
        continue;
      }
      if(listener.args[0] === undefined) {
        listener.callback.apply(listener.scope, [keyCode].concat(listener.args));
      }
      else if(listener.args[0] == keyCode) {
        listener.callback.apply(listener.scope, listener.args);
      }
      listener.executed = true;
    }
    i = listeners.length;
    while(i--){
      let listener = listeners[i];
      if(listener === undefined){
        listeners.splice(i, 1);
      }
      else {
        listener.executed = false;
      }
    }
  }

  isDown(key) {
    return this._keys[key] || false;
  }

  dispose() {
    this.onDown.dispose();
    this.onUp.dispose();
    this.target.removeEventListener("keydown", this._downBind);
    this.target.removeEventListener("keyup", this._upCallBind);
  }

  preventDefault(keys) {
    if(keys){
      this._preventDefaultKeys = this._preventDefaultKeys.concat(keys);
    }
    else {
      this._preventDefaultKeys = [-1];
    }
  }

  _doPreventDefault(e) {
    var k = this._preventDefaultKeys;
    if(k.indexOf(e.keyCode.toString()) != -1 || k[0] == -1){
      e.preventDefault();
    }
  }
}

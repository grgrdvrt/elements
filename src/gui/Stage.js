import * as maths from "../maths";

export class Stage {
    constructor(canvas, params){

        const props = Object.assign({
            window : maths.Rectangle.makeArea(-1.2, 1.2, 1.2, -1.2)
        }, params);

        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.window = props.window;

        this.scale = new maths.Vector2(1, 1);
        this.translation = new maths.Vector2();
        this.computeTransform();

        this.items = [];
    }

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    add(...items){
        items.forEach(item => {
            if(this.items.indexOf(item) !== -1){
                return;
            }
            this.items.push(item);
        });
    }

    remove(...items){
        items.forEach(item => {
            const id = this.items.indexOf(item);
            if(id !== -1){
                this.items.splice(id, 1);
            }
        });
    }

    computeTransform(){
        const sx = this.width / this.window.width;
        const sy = this.height / this.window.height;

        this.scale.set(sx, sy);
        this.translation.set(
            -this.window.x * this.scale.x,
            -this.window.y * this.scale.y
        );
    }


    _drawItems(items, frameId){
        items.forEach(item => {
            if(Array.isArray(item)){
                this._drawItems(item, frameId);
            }
            else {
                item.construction.update(frameId);
                item.drawingFunc(this, item);
            }
        });
    }

    domToWindowCoords(v){
        return v.sub(this.translation).divide(this.scale);
    }

    windowToDomCoords(v, result = new maths.Vector2()){
        return v.multiply(this.scale).sub(this.translation);
    }

    draw(frameId){
        this.computeTransform();

        this._drawItems(this.items, frameId);
    }

    get width(){ return this.canvas.width; }

    get height(){ return this.canvas.height; }
}

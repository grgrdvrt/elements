import {Vector2} from "./Vector2";

export class Rectangle{
    static makeArea(xMin, xMax, yMin, yMax){
        return (new Rectangle()).setCorners(xMin, xMax, yMin, yMax);
    }

    constructor(x, y, width, height){
        this.set(x, y, width, height);
    }

    set(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    setCorners(xMin, xMax, yMin, yMax){
        this.x = xMin;
        this.y = yMin;
        this.width = xMax - xMin;
        this.height = yMax - yMin;
        return this;
    }

    contains(x, y){
        const xMin = Math.min(this.x, this.x + this.width);
        const xMax = Math.max(this.x, this.x + this.width);
        const yMin = Math.min(this.y, this.y + this.height);
        const yMax = Math.max(this.y, this.y + this.height);
        return x >= xMin && x <= xMax &&
               y >= yMin && y <= yMax;
    }

    copy(rect){
        this.x = rect.x;
        this.y = rect.y;
        this.width = rect.width;
        this.height = rect.height;
        return this;
    }

    clone(){
        return (new Rectangle()).copy(this);
    }
}

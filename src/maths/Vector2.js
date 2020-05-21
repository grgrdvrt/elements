import * as maths from "./index";

let pool = [];

export class Vector2{
    static create(x = 0, y = 0){
        if(pool.length > 0){
            return pool.pop().set(x, y);
        }
        else return new Vector2(x, y);
    }

    static dist(v1, v2){
        let dx = v2.x - v1.x;
        let dy = v2.y - v1.y;
        return Math.hypot(dx, dy);
    }

    static angle(v1, v2){
        let ang1 = Math.atan2(v1.y, v1.x);
        let ang2 = Math.atan2(v2.y, v2.x);
        return ang1 + ang2;
    }

    static lerp(v1, v2, t){
        return v1.clone().lerp(v2, t);
    }

    constructor(x, y){
        this.set(x, y);
    }

    add(v){
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v){
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiplyScalar(s){
        this.x *= s;
        this.y *= s;
        return this;
    }

    scale(sx, sy){
        this.x *= sx;
        this.y *= sy;
        return this;
    }

    multiply(v){
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    divide(v){
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    lerp(v1, v2, t){
        this.x = maths.lerp(v1.x, v2.x, t);
        this.y = maths.lerp(v1.y, v2.y, t);
        return this;
    }

    clone(){
        return Vector2.create(this.x, this.y);
    }

    copy(v){
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    set(x = 0, y = 0){
        this.x = x;
        this.y = y;
        return this;
    }

    normalize(){
        return this.setLength(1);
    }

    setLength(l){
        let r = l / this.getLength();
        this.x *= r;
        this.y *= r;
        return this;
    }

    getLength(){
        return Math.hypot(this.x, this.y);
    }

    dot(v){
        return this.x * v.x + this.y * v.y;

    }

    cross(v){
        return this.x * v.y - this.y * v.x;
    }

    rotate(a){
        let ca = Math.cos(a);
        let sa = Math.sin(a);
        let x = this.x;
        let y = this.y;
        this.x = ca * x - sa * y;
        this.y = ca * y + sa * x;
        return this;
    }

    dispose(){
        pool.push(this);
    }

    toString(){
        return `[${this.x}, ${this.y}]`
    }
}



import * as maths from "./index";

export class Circle{
    constructor(center, radius){
        this.set(center, radius);
    }

    set(center = new maths.Vector2(), radius = 1){
        this.center = center;
        this.radius = radius;
        return this;
    }

    copy(circle){
        this.center.copy(circle.center);
        this.radius = circle.radius;
        return this;
    }
}

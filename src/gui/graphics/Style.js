import Color from "./Color";

export default class Style {
  constructor(values){
    this.set(values);
  }

  set(values){
    if(values === undefined){
      values = {};
    }
    this.fill = values.fill;
    this.stroke = values.stroke;
    this.dash = values.dash;
    this.lineWidth = values.lineWidth;
  }
}


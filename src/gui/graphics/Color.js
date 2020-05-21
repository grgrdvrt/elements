export default class Color{
  constructor(h = 0, s = 0, l = 0, a = 1){
    this.set(h, s, l, a);
  }

  set(h = 0, s = 0, l = 0, a = 1){
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;
  }

  copy(color){
    this.h = color.h;
    this.s = color.s;
    this.l = color.l;
    this.a = color.a;
  }

  toString(){
    let h = Math.round(this.h);
    let s = Math.round(100 * this.s);
    let l = Math.round(100 * this.l);
    return `hsla(${h}, ${s}%, ${l}%, ${this.a})`;
  }
}

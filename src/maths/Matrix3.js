//www.j3d.org/matrix_faq/matrfaq_latest.html
export default class Matrix3
{
  constructor(
    a = 1, b = 0, c = 0,
    d = 0, e = 1, f = 0,
    g = 0, h = 0, i = 1)
  {
    this.data = new Float32Array(9);
    this.set(
      a, b, c,
      d, e, f,
      g, h, i);
  }

  identity() {
    return this.set(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
  }

  set(
    a = 1, b = 0, c = 0,
    d = 0, e = 1, f = 0,
    g = 0, h = 0, i = 1)
  {
    var t = this.data;
    t[0] = a; t[1] = b; t[2] = c;
    t[3] = d; t[4] = e; t[5] = f;
    t[6] = g; t[7] = h; t[8] = i;
    return this;
  }

  copy(mat){
    var t0 = this.data;
    var t1 = mat.data;
    t0[0] = t1[0]; t0[3] = t1[3]; t0[6] = t1[6];
    t0[1] = t1[1]; t0[4] = t1[4]; t0[7] = t1[7];
    t0[2] = t1[2]; t0[5] = t1[5]; t0[8] = t1[8];
    return this;
  }

  transformVector2(v) {
    var t = this.data;
    var x = v.x, y = v.y;
    v.x = t[0] * x + t[1] * y + t[2];
    v.y = t[3] * x + t[4] * y + t[5];
    v.z = t[6] * x + t[7] * y + t[8];
    return this;
  }

  //m x this
  multiplyMat(m) {
    var t = m.data;
    this.multiply(
      t[0], t[1], t[2],
      t[3], t[4], t[5],
      t[6], t[7], t[8]
    );
    return this;
  }

  //m x this
  multiply(
    a, b, c,
    d, e, f,
    g, h, i)
  {
    var t = this.data;
    return this.set(
      a * t[0] + b * t[3] + c * t[6],
      d * t[6] + e * t[3] + f * t[6],
      g * t[6] + h * t[3] + i * t[6],

      a * t[1] + b * t[4] + c * t[7],
      d * t[1] + e * t[4] + f * t[7],
      g * t[1] + h * t[4] + i * t[7],

      a * t[2] + b * t[5] + c * t[8],
      d * t[2] + e * t[5] + f * t[8],
      g * t[2] + h * t[5] + i * t[8]);
  }

  get determinant() {
    var t = this.data;
    return (t[0] * (t[4] * t[8] - t[7] * t[5]) -
            t[1] * (t[3] * t[8] - t[6] * t[5]) +
            t[2] * (t[3] * t[7] - t[6] * t[4]));
  }

  invert() {
    var det = this.determinant;
    if(Math.abs(det) < 0.0005){
      return this.identity();
    }
    var t = this.data;

    var iDet = 1 / det;
    return this.set(
      (t[4] * t[8] - t[7] * t[5]) * iDet,
     -(t[3] * t[8] - t[6] * t[5]) * iDet,
      (t[3] * t[7] - t[6] * t[4]) * iDet,
     -(t[1] * t[8] - t[7] * t[2]) * iDet,
      (t[0] * t[8] - t[6] * t[2]) * iDet,
     -(t[0] * t[7] - t[6] * t[1]) * iDet,
      (t[1] * t[5] - t[4] * t[2]) * iDet,
     -(t[0] * t[5] - t[3] * t[2]) * iDet,
      (t[0] * t[4] - t[3] * t[1]) * iDet
    );
  }

  transpose() {
    var t = this.data;
    return this.set(
      t[0], t[3], t[6],
      t[1], t[4], t[7],
      t[2], t[5], t[8]
    );
  }

  clone() {
    var cloneMat = new Matrix3();
    var t0 = this.data;
    var t1 = cloneMat.data;
    for(var i = 0; i < 9; i++) {
      t1[i] = t0[i];
    }
    return cloneMat;
  }

  toString() {
    var t = this.data;
    return (`[Mat3
      ${t[0]}, ${t[1]}, ${t[2]}
      ${t[3]}, ${t[4]}, ${t[5]}
      ${t[6]}, ${t[7]}, ${t[8]}
    ]`);
  }

  valueOf() {
    return this.data;
  }
}

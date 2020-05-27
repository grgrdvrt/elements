(() => {
  let __defineProperty = Object.defineProperty;
  let __hasOwnProperty = Object.hasOwnProperty;
  let __modules = {};
  let __require = (id) => {
    let module = __modules[id];
    if (!module) {
      module = __modules[id] = {
        exports: {}
      };
      __commonjs[id](module.exports, module);
    }
    return module.exports;
  };
  let __toModule = (module) => {
    if (module && module.__esModule) {
      return module;
    }
    let result = {};
    for (let key in module) {
      if (__hasOwnProperty.call(module, key)) {
        result[key] = module[key];
      }
    }
    result.default = module;
    return result;
  };
  let __import = (id) => {
    return __toModule(__require(id));
  };
  let __export = (target, all) => {
    __defineProperty(target, "__esModule", {
      value: true
    });
    for (let name in all) {
      __defineProperty(target, name, {
        get: all[name],
        enumerable: true
      });
    }
  };
  let __commonjs;
  __commonjs = {
    26() {
      // src/api/construction.js
      function updateObject(object, timeStamp) {
        if (object.lastUpdated >= timeStamp) {
          return;
        }
        if (object.input) {
          for (let key in object.input) {
            updateObject(object.input[key], timeStamp);
          }
        }
        if (object.helpers) {
          for (let key in object.helpers) {
            updateObject(object.helpers[key], timeStamp);
          }
        }
        if (object.update) {
          object.update(object, timeStamp);
        }
        object.lastUpdated = timeStamp;
      }

      // src/api/types.js
      const circleType = "circle";
      const lineType = "line";
      const pointType = "point";
      const polygonType = "polygon";
      const scalarType = "scalar";
      const segmentType = "segment";
      const vectorType = "vector";
      const funcType = "function";
      const untyped = "untyped";
      const listType = (type) => `list`;
      function makeTypedFunction(types12, func) {
        const typedFunc = (...args) => func(...spreadTypedArgs(args, types12));
        typedFunc.types = types12;
        typedFunc.baseFunc = func;
        return typedFunc;
      }
      function matchType(type, value) {
        return type === scalarType && value || type === listType() && Array.isArray(value) || type === untyped && !value.type || value.type === type;
      }
      function spreadTypedArgs(args, types12) {
        const params = Array.from(args);
        const result = [];
        if (types12.length !== params.length) {
          return void 0;
        }
        for (let type of types12) {
          let nextParam = void 0;
          for (let i = 0; i < params.length; i++) {
            const param = params[i];
            if (matchType(type, param)) {
              nextParam = param;
              params.splice(i, 1);
              break;
            }
          }
          if (nextParam === void 0) {
            return void 0;
          } else {
            result.push(nextParam);
          }
        }
        return result;
      }
      function makeDispatch(...funcs) {
        return (...args) => {
          let spreadParams = void 0;
          let func = void 0;
          for (let candidate of funcs) {
            spreadParams = spreadTypedArgs(args, candidate.types);
            if (spreadParams) {
              func = candidate;
              break;
            }
          }
          if (func) {
            return func.baseFunc(...spreadParams);
          } else {
            console.error(`no match found for args ${args}`);
            return void 0;
          }
        };
      }

      // src/maths/Vector2.js
      let pool = [];
      class Vector25 {
        static create(x = 0, y = 0) {
          if (pool.length > 0) {
            return pool.pop().set(x, y);
          } else
            return new Vector25(x, y);
        }
        static dist(v1, v2) {
          let dx = v2.x - v1.x;
          let dy = v2.y - v1.y;
          return Math.hypot(dx, dy);
        }
        static angle(v1, v2) {
          let ang1 = Math.atan2(v1.y, v1.x);
          let ang2 = Math.atan2(v2.y, v2.x);
          return ang1 + ang2;
        }
        static lerp(v1, v2, t) {
          return v1.clone().lerp(v2, t);
        }
        constructor(x, y) {
          this.set(x, y);
        }
        add(v) {
          this.x += v.x;
          this.y += v.y;
          return this;
        }
        sub(v) {
          this.x -= v.x;
          this.y -= v.y;
          return this;
        }
        multiplyScalar(s) {
          this.x *= s;
          this.y *= s;
          return this;
        }
        scale(sx, sy) {
          this.x *= sx;
          this.y *= sy;
          return this;
        }
        multiply(v) {
          this.x *= v.x;
          this.y *= v.y;
          return this;
        }
        divide(v) {
          this.x /= v.x;
          this.y /= v.y;
          return this;
        }
        lerp(v1, v2, t) {
          this.x = index2.lerp(v1.x, v2.x, t);
          this.y = index2.lerp(v1.y, v2.y, t);
          return this;
        }
        clone() {
          return Vector25.create(this.x, this.y);
        }
        copy(v) {
          this.x = v.x;
          this.y = v.y;
          return this;
        }
        set(x = 0, y = 0) {
          this.x = x;
          this.y = y;
          return this;
        }
        normalize() {
          return this.setLength(1);
        }
        setLength(l) {
          let r = l / this.getLength();
          this.x *= r;
          this.y *= r;
          return this;
        }
        getLength() {
          return Math.hypot(this.x, this.y);
        }
        dot(v) {
          return this.x * v.x + this.y * v.y;
        }
        cross(v) {
          return this.x * v.y - this.y * v.x;
        }
        rotate(a) {
          let ca = Math.cos(a);
          let sa = Math.sin(a);
          let x = this.x;
          let y = this.y;
          this.x = ca * x - sa * y;
          this.y = ca * y + sa * x;
          return this;
        }
        dispose() {
          pool.push(this);
        }
        toString() {
          return `[${this.x}, ${this.y}]`;
        }
      }

      // src/maths/Matrix3.js
      class Matrix32 {
        constructor(a = 1, b = 0, c = 0, d = 0, e = 1, f = 0, g = 0, h = 0, i = 1) {
          this.data = new Float32Array(9);
          this.set(a, b, c, d, e, f, g, h, i);
        }
        identity() {
          return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        }
        set(a = 1, b = 0, c = 0, d = 0, e = 1, f = 0, g = 0, h = 0, i = 1) {
          var t = this.data;
          t[0] = a;
          t[1] = b;
          t[2] = c;
          t[3] = d;
          t[4] = e;
          t[5] = f;
          t[6] = g;
          t[7] = h;
          t[8] = i;
          return this;
        }
        copy(mat) {
          var t0 = this.data;
          var t1 = mat.data;
          t0[0] = t1[0];
          t0[3] = t1[3];
          t0[6] = t1[6];
          t0[1] = t1[1];
          t0[4] = t1[4];
          t0[7] = t1[7];
          t0[2] = t1[2];
          t0[5] = t1[5];
          t0[8] = t1[8];
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
        multiplyMat(m) {
          var t = m.data;
          this.multiply(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
          return this;
        }
        multiply(a, b, c, d, e, f, g, h, i) {
          var t = this.data;
          return this.set(a * t[0] + b * t[3] + c * t[6], d * t[6] + e * t[3] + f * t[6], g * t[6] + h * t[3] + i * t[6], a * t[1] + b * t[4] + c * t[7], d * t[1] + e * t[4] + f * t[7], g * t[1] + h * t[4] + i * t[7], a * t[2] + b * t[5] + c * t[8], d * t[2] + e * t[5] + f * t[8], g * t[2] + h * t[5] + i * t[8]);
        }
        get determinant() {
          var t = this.data;
          return t[0] * (t[4] * t[8] - t[7] * t[5]) - t[1] * (t[3] * t[8] - t[6] * t[5]) + t[2] * (t[3] * t[7] - t[6] * t[4]);
        }
        invert() {
          var det = this.determinant;
          if (Math.abs(det) < 0.0005) {
            return this.identity();
          }
          var t = this.data;
          var iDet = 1 / det;
          return this.set((t[4] * t[8] - t[7] * t[5]) * iDet, -(t[3] * t[8] - t[6] * t[5]) * iDet, (t[3] * t[7] - t[6] * t[4]) * iDet, -(t[1] * t[8] - t[7] * t[2]) * iDet, (t[0] * t[8] - t[6] * t[2]) * iDet, -(t[0] * t[7] - t[6] * t[1]) * iDet, (t[1] * t[5] - t[4] * t[2]) * iDet, -(t[0] * t[5] - t[3] * t[2]) * iDet, (t[0] * t[4] - t[3] * t[1]) * iDet);
        }
        transpose() {
          var t = this.data;
          return this.set(t[0], t[3], t[6], t[1], t[4], t[7], t[2], t[5], t[8]);
        }
        clone() {
          var cloneMat = new Matrix32();
          var t0 = this.data;
          var t1 = cloneMat.data;
          for (var i = 0; i < 9; i++) {
            t1[i] = t0[i];
          }
          return cloneMat;
        }
        toString() {
          var t = this.data;
          return `[Mat3
      ${t[0]}, ${t[1]}, ${t[2]}
      ${t[3]}, ${t[4]}, ${t[5]}
      ${t[6]}, ${t[7]}, ${t[8]}
    ]`;
        }
        valueOf() {
          return this.data;
        }
      }

      // src/maths/Line.js
      class Line3 {
        constructor(point9 = new index2.Vector2(), vector4 = new index2.Vector2()) {
          this.point = point9;
          this.vector = vector4;
        }
        getYFromX(x) {
          const t = (x - this.point.x) / this.vector.x;
          return this.point.y + t * this.vector.y;
        }
        getXFromY(y) {
          const t = (y - this.point.y) / this.vector.y;
          return this.point.x + t * this.vector.x;
        }
        getPointAt(t, v = new index2.Vector2()) {
          return v.copy(this.vector).multiplyScalar(t).add(this.point);
        }
      }

      // src/maths/Segment.js
      class Segment4 {
        constructor(p1 = new index2.Vector2(), p2 = new index2.Vector2()) {
          this.p1 = p1;
          this.p2 = p2;
        }
      }

      // src/maths/Circle.js
      class Circle5 {
        constructor(center, radius) {
          this.set(center, radius);
        }
        set(center = new index2.Vector2(), radius = 1) {
          this.center = center;
          this.radius = radius;
        }
        copy(circle5) {
          this.center.copy(circle5.center);
          this.radius = circle5.radius;
        }
      }

      // src/maths/Rectangle.js
      class Rectangle4 {
        static makeArea(xMin, xMax, yMin, yMax) {
          return new Rectangle4().setCorners(xMin, xMax, yMin, yMax);
        }
        constructor(x, y, width, height) {
          this.set(x, y, width, height);
        }
        set(x, y, width, height) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          return this;
        }
        setCorners(xMin, xMax, yMin, yMax) {
          this.x = xMin;
          this.y = yMin;
          this.width = xMax - xMin;
          this.height = yMax - yMin;
          return this;
        }
        contains(x, y) {
          const xMin = Math.min(this.x, this.x + this.width);
          const xMax = Math.max(this.x, this.x + this.width);
          const yMin = Math.min(this.y, this.y + this.height);
          const yMax = Math.max(this.y, this.y + this.height);
          return x >= xMin && x <= xMax && y >= yMin && y <= yMax;
        }
        copy(rect) {
          this.x = rect.x;
          this.y = rect.y;
          this.width = rect.width;
          this.height = rect.height;
          return this;
        }
        clone() {
          return new Rectangle4().copy(this);
        }
      }

      // src/maths/intersection.js
      function linesIntersection4(l1, l2, v = new index2.Vector2()) {
        let xv1 = l1.vector.x;
        let yv1 = l1.vector.y;
        let xv2 = l2.vector.x;
        let yv2 = l2.vector.y;
        let dxp = l2.point.x - l1.point.x;
        let dyp = l2.point.y - l1.point.y;
        let t = (yv2 * dxp - xv2 * dyp) / (xv1 * yv2 - xv2 * yv1);
        return l1.getPointAt(t, v);
      }
      function lineCircleIntersection2(line5, circle5, v1 = new index2.Vector2(), v2 = new index2.Vector2()) {
        let v = line5.vector;
        let p = line5.point;
        let c = circle5.center;
        let r = circle5.radius;
        let roots = index2.quadraticRoots(v.dot(v), 2 * (p.x * v.x + p.y * v.y - c.x * v.x - c.y * v.y), c.dot(c) + p.dot(p) - 2 * (c.x * p.x + c.y * p.y) - r * r);
        line5.getPointAt(roots.x1, v1);
        line5.getPointAt(roots.x2, v2);
      }
      function circlesIntersections3(circle1, circle22, v1 = new index2.Vector2(), v2 = new index2.Vector2()) {
        let c1 = circle1.center;
        let c2 = circle22.center;
        let r1 = circle1.radius;
        let r2 = circle22.radius;
        let dx = c2.x - c1.x;
        let dy = c2.y - c1.y;
        let ddx = c2.x * c2.x - c1.x * c1.x;
        let ddy = c2.y * c2.y - c1.y * c1.y;
        let ddr = r1 * r1 - r2 * r2;
        let s1 = dx / dy;
        let s2 = (ddr + ddx + ddy) / dy;
        let s3 = c1.y - s2 / 2;
        let roots, f;
        if (dy === 0) {
          let x = (ddx + ddr) / (2 * dx);
          let dx2 = c1.x - x;
          roots = index2.quadraticRoots(1, -2 * c1.y, c1.y * c1.y + dx2 * dx2 - r1 * r1);
          f = (v, y) => v.set(x, y);
        } else {
          roots = index2.quadraticRoots(1 + s1 * s1, 2 * (s1 * s3 - c1.x), s3 * s3 + c1.x * c1.x - r1 * r1);
          f = (v, x) => v.set(x, s2 / 2 - s1 * x);
        }
        if (c2.y > c1.y) {
          let t = roots.x1;
          roots.x1 = roots.x2;
          roots.x2 = t;
        }
        f(v1, roots.x1);
        f(v2, roots.x2);
        return {
          v1,
          v2
        };
      }

      // src/maths/projection.js
      function projectVectorOnCircle2(vector4, circle5, result = new index2.Vector2()) {
        result.copy(vector4).sub(circle5.center).setLength(circle5.radius).add(circle5.center);
        return result;
      }
      function projectVectorOnLine2(vector4, line5) {
        let ab = line5.vector.getLength();
        let ac = index2.vectorsDistance(line5.point, vector4);
        let bc = index2.vectorsDistance(line5.point.clone().add(line5.vector), vector4);
        let ai = -(bc * bc - ab * ab - ac * ac) / (2 * ab);
        let result = line5.vector.clone().setLength(ai).add(line5.point);
        vector4.copy(result);
        result.dispose();
        return vector4;
      }

      // src/maths/distance.js
      function vectorsDistance2(v1, v2) {
        let dx = v2.x - v1.x;
        let dy = v2.y - v1.y;
        return Math.hypot(dx, dy);
      }
      function vectorLineDistance2(vector4, line5) {
        let l2 = new index2.Line(vector4, new index2.Vector2(-line5.vector.y, line5.vector.x));
        let p = index2.linesIntersection(line5, l2);
        return vectorsDistance2(vector4, p);
      }
      function vectorCircleDistance2(v, c) {
        return vectorsDistance2(v, c.center) - c.radius;
      }
      function circlesDistance(c1, c2) {
        return vectorsDistance2(c1.center, c2.center) - (c1.radius + c2.radius);
      }
      function lineCircleDistance(l, c) {
        return vectorLineDistance2(c.center, l) - c.radius;
      }

      // src/maths/symmetry.js
      function pointAxialSymmetry2(point9, axis) {
        let tmp = point9.clone();
        pointCentralSymmetry3(point9, index2.projectVectorOnLine(tmp, axis));
        tmp.dispose();
        return point9;
      }
      function pointCentralSymmetry3(point9, center) {
        point9.x = 2 * center.x - point9.x;
        point9.y = 2 * center.y - point9.y;
        return point9;
      }
      function circleAxialSymmetry3(circle5, axis) {
        pointAxialSymmetry2(circle5.center, axis);
      }
      function circleCentralSymmetry3(circle5, center) {
        pointCentralSymmetry3(circle5.center, center);
      }

      // src/maths/index.js
      var index2 = {};
      __export(index2, {
        Circle: () => Circle5,
        Line: () => Line3,
        Rectangle: () => Rectangle4,
        Segment: () => Segment4,
        Vector2: () => Vector25,
        circleAxialSymmetry: () => circleAxialSymmetry3,
        circleCentralSymmetry: () => circleCentralSymmetry3,
        circlesDistance: () => circlesDistance,
        circlesIntersections: () => circlesIntersections3,
        default: () => Matrix32,
        lerp: () => lerp,
        lineCircleDistance: () => lineCircleDistance,
        lineCircleIntersection: () => lineCircleIntersection2,
        linesIntersection: () => linesIntersection4,
        pointAxialSymmetry: () => pointAxialSymmetry2,
        pointCentralSymmetry: () => pointCentralSymmetry3,
        projectVectorOnCircle: () => projectVectorOnCircle2,
        projectVectorOnLine: () => projectVectorOnLine2,
        quadraticRoots: () => quadraticRoots,
        vectorCircleDistance: () => vectorCircleDistance2,
        vectorLineDistance: () => vectorLineDistance2,
        vectorsDistance: () => vectorsDistance2
      });
      function quadraticRoots(a, b, c) {
        let ds = Math.sqrt(b * b - 4 * a * c);
        return {
          x1: (-b - ds) / (2 * a),
          x2: (-b + ds) / (2 * a)
        };
      }
      function lerp(a, b, t) {
        return a + t * (b - a);
      }

      // src/gui/graphics/drawing.js
      function drawPoint(stage2, point9) {
        const radius = 5;
        const x = point9.geom.x;
        const y = point9.geom.y;
        const ctx = stage2.ctx;
        ctx.beginPath();
        const s = stage2.scale;
        const t = stage2.translation;
        ctx.moveTo(t.x + x * s.x + radius, t.y + y * s.y);
        ctx.arc(t.x + x * s.x, t.y + y * s.y, radius, 0, 2 * Math.PI);
        const style = point9.style;
        ctx.save();
        if (style.stroke !== void 0) {
          ctx.strokeStyle = style.stroke.toString();
          if (style.dash !== void 0) {
            ctx.setLineDash(style.dash);
          }
          ctx.stroke();
        }
        if (style.fill !== void 0) {
          ctx.fillStyle = style.fill.toString();
          ctx.fill();
        }
        ctx.restore();
      }
      function drawCircle(stage2, circle5) {
        const c = circle5.geom.center;
        const r = circle5.geom.radius;
        const ctx = stage2.ctx;
        ctx.beginPath();
        ctx.save();
        ctx.translate(stage2.translation.x, stage2.translation.y);
        ctx.scale(stage2.scale.x, stage2.scale.y);
        ctx.moveTo(c.x + r, c.y);
        ctx.arc(c.x, c.y, r, 0, 2 * Math.PI);
        ctx.restore();
        ctx.save();
        const style = circle5.style;
        if (style.stroke !== void 0) {
          ctx.strokeStyle = style.stroke.toString();
          if (style.dash !== void 0) {
            ctx.setLineDash(style.dash);
          }
          ctx.stroke();
        }
        if (style.fill !== void 0) {
          ctx.fillStyle = style.fill.toString();
          ctx.fill();
        }
        ctx.restore();
      }
      function drawSegment(stage2, segment4) {
        const ctx = stage2.ctx;
        const p1 = segment4.geom.p1;
        const p2 = segment4.geom.p2;
        ctx.beginPath();
        ctx.save();
        ctx.translate(stage2.translation.x, stage2.translation.y);
        ctx.scale(stage2.scale.x, stage2.scale.y);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.restore();
        const style = segment4.style;
        ctx.save();
        if (style.stroke !== void 0) {
          ctx.strokeStyle = style.stroke.toString();
          ctx.stroke();
          if (style.dash !== void 0) {
            ctx.setLineDash(style.dash);
          }
        }
        ctx.restore();
      }
      function drawLine(stage2, line5) {
        const l = line5.geom;
        const ctx = stage2.ctx;
        ctx.beginPath();
        const w = stage2.window;
        ctx.save();
        ctx.translate(stage2.translation.x, stage2.translation.y);
        ctx.scale(stage2.scale.x, stage2.scale.y);
        if (l.vector.x === 0) {
          ctx.moveTo(l.point.x, w.y);
          ctx.lineTo(l.point.x, w.y + w.height);
        } else {
          ctx.moveTo(w.x, l.getYFromX(w.x));
          ctx.lineTo(w.x + w.width, l.getYFromX(w.x + w.width));
        }
        ctx.restore();
        const style = line5.style;
        ctx.save();
        if (style.stroke !== void 0) {
          ctx.strokeStyle = style.stroke.toString();
          if (style.dash !== void 0) {
            ctx.setLineDash(style.dash);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
      function drawVector(stage2, vector4) {
        const ctx = stage2.ctx;
        const p1 = vector4.geom.p1;
        const p2 = vector4.geom.p2;
        ctx.beginPath();
        ctx.save();
        ctx.translate(stage2.translation.x, stage2.translation.y);
        ctx.scale(stage2.scale.x, stage2.scale.y);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.restore();
        const style = vector4.style;
        ctx.save();
        if (style.stroke !== void 0) {
          ctx.strokeStyle = style.stroke.toString();
          if (style.dash !== void 0) {
            ctx.setLineDash(style.dash);
          }
          ctx.stroke();
        }
        ctx.restore();
        ctx.save();
        ctx.translate(stage2.translation.x, stage2.translation.y);
        ctx.scale(stage2.scale.x, stage2.scale.y);
        const arrowLength = 5 / stage2.scale.x;
        const arrowWidth = 5 / stage2.scale.x;
        const end = p2;
        const diff = p2.clone().sub(p1);
        const length = diff.clone().setLength(arrowLength);
        const width = diff.clone().setLength(arrowWidth);
        const end2 = end.clone().sub(length);
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end2.x + width.y, end2.y - width.x);
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end2.x - width.y, end2.y + width.x);
        ctx.restore();
        ctx.save();
        if (style.stroke !== void 0) {
          ctx.strokeStyle = style.stroke.toString();
          ctx.stroke();
        }
        ctx.restore();
      }
      function drawPolygon(stage2, polygon3) {
        const ctx = stage2.ctx;
        ctx.beginPath();
        ctx.save();
        ctx.translate(stage2.translation.x, stage2.translation.y);
        ctx.scale(stage2.scale.x, stage2.scale.y);
        const pts = polygon3.geom;
        const n = pts.length;
        let p = pts[n - 1];
        ctx.moveTo(p.x, p.y);
        for (let i = 0; i < n; i++) {
          p = pts[i];
          ctx.lineTo(p.x, p.y);
        }
        ctx.restore();
        const style = polygon3.style;
        ctx.save();
        if (style.stroke !== void 0) {
          ctx.strokeStyle = style.stroke.toString();
          if (style.dash !== void 0) {
            ctx.setLineDash(style.dash);
          }
          ctx.stroke();
        }
        if (style.fill !== void 0) {
          ctx.fillStyle = style.fill.toString();
          ctx.fill();
        }
        ctx.restore();
      }
      function drawFuncGraph(stage2, func) {
        const ctx = stage2.ctx;
        ctx.beginPath();
        const w = stage2.window;
        ctx.save();
        ctx.translate(stage2.translation.x, stage2.translation.y);
        ctx.scale(stage2.scale.x, stage2.scale.y);
        let prev = {
          x: w.x,
          y: func.input.func(w.x)
        };
        let isPrevVisible = w.contains(prev.x, prev.y);
        ctx.moveTo(prev.x, prev.y);
        const nSteps = stage2.scale.x * w.width;
        for (let i = 0; i < nSteps; i++) {
          const x = w.x + lerp(0, w.width, i / nSteps);
          const val = func.input.func(x);
          const isValVisible = w.contains(x, val);
          if (isPrevVisible) {
            ctx.lineTo(x, val);
            isPrevVisible = isValVisible;
          } else if (isValVisible) {
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(x, val);
            isPrevVisible = true;
          } else {
            isPrevVisible = false;
          }
          prev = {
            x,
            y: val
          };
        }
        ctx.restore();
        const style = func.style;
        ctx.save();
        if (style.stroke !== void 0) {
          ctx.strokeStyle = style.stroke.toString();
          if (style.dash !== void 0) {
            ctx.setLineDash(style.dash);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // src/gui/graphics/Color.js
      class Color2 {
        constructor(h = 0, s = 0, l = 0, a = 1) {
          this.set(h, s, l, a);
        }
        set(h = 0, s = 0, l = 0, a = 1) {
          this.h = h;
          this.s = s;
          this.l = l;
          this.a = a;
        }
        copy(color) {
          this.h = color.h;
          this.s = color.s;
          this.l = color.l;
          this.a = color.a;
        }
        toString() {
          let h = Math.round(this.h);
          let s = Math.round(100 * this.s);
          let l = Math.round(100 * this.l);
          return `hsla(${h}, ${s}%, ${l}%, ${this.a})`;
        }
      }

      // src/gui/graphics/Style.js
      class Style2 {
        constructor(values) {
          this.set(values);
        }
        set(values) {
          if (values === void 0) {
            values = {};
          }
          this.fill = values.fill;
          this.stroke = values.stroke;
          this.dash = values.dash;
          this.lineWidth = values.lineWidth;
        }
      }

      // src/constructions/scalar.js
      function scalar2(value) {
        return {
          type: scalarType,
          value: value.type === scalarType ? value.value : value
        };
      }

      // src/constructions/line.js
      function baseLine() {
        return {
          type: lineType,
          style: new Style2({
            stroke: "black"
          }),
          drawingFunc: drawLine,
          output: null,
          geom: new index2.Line(),
          lastUpdated: -1
        };
      }
      const lineFromPoints = makeTypedFunction([pointType, pointType], (p1, p2) => ({
        ...baseLine(),
        description: "line from points",
        input: {
          p1,
          p2
        },
        update({geom}) {
          geom.point.copy(p1.geom);
          geom.vector.copy(p2.geom).sub(p1.geom);
        }
      }));
      const lineFromPointVector = makeTypedFunction([pointType, vectorType], (point9, vector4) => ({
        description: "line from (point, vector)",
        ...baseLine(),
        input: {
          point: point9,
          vector: vector4
        },
        update({geom}) {
          geom.set(point9.geom, vector4.geom);
        }
      }));
      const perpendicular = makeTypedFunction([lineType, pointType], (line5, point9) => {
        return {
          ...baseLine(),
          description: "line from (point, vector)",
          input: {
            line: line5,
            point: point9
          },
          update({geom}) {
            geom.point.copy(point9.geom);
            const lv = line5.geom.vector;
            geom.vector.set(-lv.y, lv.x);
          }
        };
      });
      const segmentBissector = makeTypedFunction([segmentType], (segment4) => ({
        description: "segment bissector",
        ...baseLine(),
        input: {
          segment: segment4
        },
        update({geom}) {
          const p1 = segment4.geom.p1;
          const p2 = segment4.geom.p2;
          geom.point.lerp(p1, p2, 0.5);
          geom.vector.set(p1.y - p2.y, p2.x - p1.x);
        }
      }));
      const angleBissector = makeTypedFunction([pointType, pointType, pointType], (p1, p2, p3) => {
        const tmp = new index2.Vector2();
        return {
          description: "angle bissector",
          ...baseLine(),
          input: {
            p1,
            p2,
            p3
          },
          update({input, geom}) {
            const p12 = input.p1.geom;
            const p22 = input.p2.geom;
            const p32 = input.p3.geom;
            const len = index2.Vector2.dist(p22, p32);
            tmp.copy(p12).sub(p22).setLength(len).add(p22);
            tmp.lerp(tmp, p32, 0.5);
            geom.point.copy(p22);
            geom.vector.copy(tmp).sub(p22).normalize();
          }
        };
      });
      function line2(a, b) {
        if (a.type === pointType && b.type === pointType) {
          return lineFromPoints(a, b);
        } else if (a.type === pointType && b.type === vectorType) {
          return lineFromPointVector();
        }
        if (!Number.isNaN(a)) {
          a = scalar2(a);
        }
        if (!Number.isNaN(b)) {
          b = scalar2(b);
        }
        if (a.type === pointType && b.type === scalarType) {
          throw new Error("not implemented yet");
        } else if (a.type === vectorType && b.type === scalarType) {
          throw new Error("not implemented yet");
        } else if (a.type === scalarType && b.type === scalarType) {
          throw new Error("not implemented yet");
        } else {
          throw new Error("no line constructor for given params : " + a + ", " + b);
        }
      }

      // src/constructions/segment.js
      function baseSegment() {
        return {
          type: segmentType,
          style: new Style2({
            stroke: "black"
          }),
          drawingFunc: drawSegment,
          geom: new index2.Segment()
        };
      }
      const segmentFromPoints = (p1, p2) => ({
        ...baseSegment(),
        description: "segment from points",
        input: {
          p1,
          p2
        },
        update: ({geom}) => {
          geom.p1.copy(p1.geom);
          geom.p2.copy(p2.geom);
        }
      });
      const segmentFromVector = (vector4) => ({
        ...baseSegment(),
        description: "segment from vector",
        input: {
          vector: vector4
        },
        update: ({geom}) => {
          geom.p1.copy(vector4.p1.geom);
          geom.p2.copy(vector4.p2.geom);
        }
      });
      const segmentFromPointVector = (point9, vector4) => ({
        ...baseSegment(),
        description: "segment from point vector",
        input: {
          point: point9,
          vector: vector4
        },
        update: ({geom}) => {
          geom.copy(point9.geom);
          geom.copy(point9.geom).add(vector4.geom);
        }
      });
      function segment2(...params) {
        if (params.length === 1 && params[0].type === vectorType) {
          return segmentFromVector(params[0]);
        } else if (params[0].type === pointType && params[1].type === pointType) {
          return segmentFromPoints(params[0], params[1]);
        } else if (params[0].type === pointType && params[1].type === vectorType) {
          return segmentFromPointVector(params[0], params[1]);
        } else {
          throw new Error("no line constructor for given params : " + params.join(", "));
        }
      }

      // src/constructions/point.js
      var point = {};
      __export(point, {
        barycenter: () => barycenter,
        basePoint: () => basePoint,
        circlesIntersections: () => circlesIntersections,
        circumCenter: () => circumCenter,
        lineCircleIntersections: () => lineCircleIntersections,
        linesIntersection: () => linesIntersection,
        middle: () => middle,
        mouse: () => mouse,
        point: () => point5,
        pointAxialSymmetry: () => pointAxialSymmetry,
        pointCentralSymmetry: () => pointCentralSymmetry,
        pointOnCircle: () => pointOnCircle,
        pointOnLine: () => pointOnLine,
        pointOnObject: () => pointOnObject,
        pointOnPerpendicular: () => pointOnPerpendicular,
        randomPoint: () => randomPoint
      });
      function basePoint() {
        return {
          type: pointType,
          style: new Style2({
            fill: "black"
          }),
          drawingFunc: drawPoint,
          geom: new index2.Vector2()
        };
      }
      const randomPoint = (area) => {
        return point5(area.x + Math.random() * area.width, area.y + Math.random() * area.height);
      };
      const middle = makeTypedFunction([segmentType], (segment4) => ({
        description: "segment middle",
        ...basePoint(),
        input: {
          segment: segment4
        },
        update({input, geom}) {
          geom.lerp(input.segment.geom.p1, input.segment.geom.p2, 0.5);
        }
      }));
      const pointOnPerpendicular = makeTypedFunction([lineType, pointType], (line5, point9) => ({
        description: "point on perpendicular",
        ...basePoint(),
        input: {
          line: line5,
          point: point9
        },
        update({input, geom}) {
          const pt = input.point.geom;
          const v = input.line.geom.vector;
          geom.set(pt.x - v.y, pt.y + v.y);
        }
      }));
      const barycenter = makeTypedFunction([listType(pointType), listType(scalarType)], (pts, weights) => {
        if (weights === void 0) {
          weights = pts.map(() => 1);
        }
        const tmp = new index2.Vector2();
        return {
          description: "barycenter",
          ...basePoint(),
          input: {
            pts,
            weights
          },
          helpers: {},
          update({geom}) {
            geom.set(0, 0);
            pts.forEach((pt, i) => {
              geom.add(tmp.copy(pt.geom).multiplyScalar(weights[i]));
            });
            geom.multiplyScalar(1 / weights.reduce((t, w) => t + w, 0));
          }
        };
      });
      const circumCenter = makeTypedFunction([pointType, pointType, pointType], (p1, p2, p3) => {
        const l1 = segmentBissector(segment2(p1, p2));
        const l2 = segmentBissector(segment2(p1, p3));
        return {
          description: "circum center",
          ...basePoint(),
          input: {
            p1,
            p2,
            p3
          },
          helpers: {
            l1,
            l2
          },
          update({geom, helpers}) {
            index2.linesIntersection(helpers.l1.geom, helpers.l2.geom, geom);
          }
        };
      });
      const lineCircleIntersections = makeTypedFunction([lineType, circleType], (line5, circle5) => {
        return {
          description: "line circle intersections",
          input: {
            line: line5,
            circle: circle5
          },
          output: [basePoint(), basePoint()],
          update({output}) {
            index2.lineCircleIntersection(line5.geom, circle5.geom, output[0].geom, output[1].geom);
          }
        };
      });
      const circlesIntersections = makeTypedFunction([circleType, circleType], (c1, c2) => {
        const result = {
          description: "circles intersections",
          input: {
            c1,
            c2
          },
          type: listType(pointType),
          update({output}) {
            index2.circlesIntersections(c1.geom, c2.geom, output[0].geom, output[1].geom);
          }
        };
        result.output = [basePoint(), basePoint()].map((p) => ({
          ...p,
          description: "circles intersection",
          input: {
            c1,
            c2
          },
          helpers: {
            result
          }
        }));
        return result;
      });
      const linesIntersection = makeTypedFunction([lineType, lineType], (l1, l2) => {
        const pt = basePoint();
        return {
          ...pt,
          description: "lines intersection",
          input: {
            l1,
            l2
          },
          update({geom}) {
            index2.linesIntersection(l1.geom, l2.geom, geom);
          }
        };
      });
      const pointOnLine = makeTypedFunction([lineType, untyped], (line5, position) => {
        const pt = basePoint();
        pt.geom.copy(position);
        return {
          ...pt,
          description: "point on line",
          input: {
            line: line5
          },
          update({geom}) {
            index2.projectVectorOnLine(geom, line5.geom);
          }
        };
      });
      const pointOnCircle = makeTypedFunction([circleType, untyped], (circle5, position) => {
        const pt = basePoint();
        pt.geom.copy(position);
        return {
          ...pt,
          description: "point on circle",
          input: {
            circle: circle5
          },
          update({geom}) {
            index2.projectVectorOnCircle(geom, circle5.geom, geom);
          }
        };
      });
      const mouse = (stage2, mouse5) => ({
        ...basePoint(),
        selectable: false,
        description: "mouse",
        input: {},
        update({geom}) {
          geom.copy(mouse5.position);
        }
      });
      const pointCentralSymmetry = makeTypedFunction([pointType, pointType], (point9, center) => ({
        ...basePoint(),
        description: "point central symmetry",
        input: {
          point: point9,
          center
        },
        update({geom}) {
          index2.pointCentralSymmetry(geom.copy(point9.geom), center);
        }
      }));
      const pointAxialSymmetry = makeTypedFunction([pointType, lineType], (point9, axis) => ({
        ...basePoint(),
        description: "point axial symmetry",
        input: {
          point: point9,
          axis
        },
        update({geom}) {
          index2.pointaxialSymmetry(geom.copy(point9.geom), axis);
        }
      }));
      function point5(x, y) {
        const pt = basePoint();
        pt.geom.set(x, y);
        return pt;
      }
      function pointOnObject(obj, position) {
        switch (obj.type) {
          case pointType:
            return obj;
          case circleType:
            return pointOnCircle(obj, position);
          case lineType:
            return pointOnLine(obj, position);
          default:
            throw new Error("no implementation for type : " + obj.type);
            break;
        }
      }

      // src/api/selection.js
      function selectInCircle(objects, circle5) {
        const result = [];
        objects.forEach((object) => {
          if (object.selectable === false) {
            return;
          }
          if (Array.isArray(object)) {
            result.push(...selectInCircle(object, circle5));
          } else {
            let distance2;
            switch (object.type) {
              case pointType:
                distance2 = index2.vectorsDistance(circle5.center, object.geom);
                break;
              case lineType:
                distance2 = index2.vectorLineDistance(circle5.center, object.geom);
                break;
              case circleType:
                distance2 = index2.vectorCircleDistance(circle5.center, object.geom);
                break;
              default:
                console.warn("type not handled : " + object.type);
                return;
                break;
            }
            result.push({
              object,
              distance: distance2
            });
          }
        });
        return result.filter((o) => Math.abs(o.distance) < circle5.radius);
      }

      // src/constructions/circle.js
      function baseCircle() {
        return {
          type: circleType,
          style: new Style2({
            stroke: "black"
          }),
          drawingFunc: drawCircle,
          geom: new index2.Circle(),
          output: null,
          lastUpdated: -1
        };
      }
      const circleAxialSymmetry = makeTypedFunction([circleType, lineType], (c, axis) => ({
        ...baseCircle(),
        description: "circle axial symmetry",
        input: {
          c,
          axis
        },
        update({geom}) {
          geom.copy(c.geom);
          index2.circleAxialSymmetry(geom, axis.geom);
        }
      }));
      const circleCentralSymmetry = makeTypedFunction([circleType, pointType], (c, center) => ({
        ...baseCircle(),
        description: "circle central symmetry",
        input: {
          c,
          center
        },
        update({geom}) {
          geom.copy(c.geom);
          index2.circleCentralSymmetry(geom, center.geom);
        }
      }));
      const circumCircle = makeTypedFunction([pointType, pointType, pointType], (p1, p2, p3) => ({
        ...baseCircle(),
        description: "circum circle",
        input: {
          p1,
          p2,
          p3
        },
        helpers: {
          center: circumCenter(p1, p2, p3)
        },
        update({geom, helpers}) {
          geom.center.copy(helpers.center.geom);
          geom.radius = index2.Vector2.dist(helpers.center.geom, p1.geom);
        }
      }));
      const circleFromCenterPoint = makeTypedFunction([pointType, pointType], (center, point9) => ({
        ...baseCircle(),
        description: "Circle from (center, point)",
        input: {
          center,
          point: point9
        },
        update({geom}) {
          geom.center.copy(center.geom);
          geom.radius = index2.Vector2.dist(geom.center, point9.geom);
        }
      }));
      const circleFromCenterRadius = makeTypedFunction([pointType, scalarType], (center, radius) => ({
        ...baseCircle(),
        description: "Circle from (center, radius)",
        input: {
          center,
          radius: scalar2(radius)
        },
        update({geom}) {
          geom.center.copy(center.geom);
          geom.radius = radius.value;
        }
      }));
      const circle2 = makeDispatch(circumCircle, circleFromCenterPoint, circleFromCenterRadius);

      // src/constructions/functionGraph.js
      const functionGraph2 = (func) => ({
        type: funcType,
        style: new Style2({
          stroke: "black"
        }),
        drawingFunc: drawFuncGraph,
        input: {
          func
        },
        output: null,
        lastUpdated: -1
      });

      // src/constructions/vector.js
      function baseVector() {
        return {
          type: vectorType,
          style: new Style2({
            stroke: "black"
          }),
          drawingFunc: drawVector,
          geom: new index2.Segment()
        };
      }
      const vector2 = (p1, p2) => ({
        ...baseVector(),
        description: "Vector point point",
        input: {
          p1,
          p2
        },
        update({geom}) {
          geom.p1.copy(p1.geom);
          geom.p2.copy(p2.geom);
        }
      });

      // src/constructions/polygon.js
      function basePolygon(pts) {
        return {
          type: polygonType,
          style: new Style2({
            stroke: "black"
          }),
          drawingFunc: drawPolygon,
          geom: pts
        };
      }
      const regularPolygon = (center, vertex, sides) => {
        const pts = [vertex.geom];
        for (let i = 0; i < sides - 1; i++) {
          pts.push(new index2.Vector2());
        }
        return {
          ...basePolygon(pts),
          description: "regular polygon",
          input: {
            center,
            vertex,
            sides
          },
          update: ({geom}) => {
            const diff = vertex.geom.clone().sub(center.geom);
            const radius = diff.getLength();
            const angBegin = Math.atan2(diff.y, diff.x);
            geom.forEach((pt, i) => {
              if (i === 0)
                return;
              const ang = angBegin + i * 2 * Math.PI / sides;
              pt.x = Math.cos(ang);
              pt.y = Math.sin(ang);
              pt.multiplyScalar(radius).add(center.geom);
            });
          }
        };
      };
      function polygon2(...pts) {
        if (Array.isArray(pts[0])) {
          pts = pts[0];
        }
        if (pts[0].type === pointType) {
          pts = pts.map((p) => p.geom);
        }
        return basePolygon(pts);
      }

      // src/api/index.js
      var index = {};
      __export(index, {
        angleBissector: () => angleBissector,
        barycenter: () => barycenter,
        baseCircle: () => baseCircle,
        baseLine: () => baseLine,
        basePoint: () => basePoint,
        basePolygon: () => basePolygon,
        baseSegment: () => baseSegment,
        baseVector: () => baseVector,
        circle: () => circle2,
        circleAxialSymmetry: () => circleAxialSymmetry,
        circleCentralSymmetry: () => circleCentralSymmetry,
        circleFromCenterPoint: () => circleFromCenterPoint,
        circleFromCenterRadius: () => circleFromCenterRadius,
        circleType: () => circleType,
        circlesIntersections: () => circlesIntersections,
        circumCenter: () => circumCenter,
        circumCircle: () => circumCircle,
        funcType: () => funcType,
        functionGraph: () => functionGraph2,
        line: () => line2,
        lineCircleIntersections: () => lineCircleIntersections,
        lineFromPointVector: () => lineFromPointVector,
        lineFromPoints: () => lineFromPoints,
        lineType: () => lineType,
        linesIntersection: () => linesIntersection,
        listType: () => listType,
        makeDispatch: () => makeDispatch,
        makeTypedFunction: () => makeTypedFunction,
        middle: () => middle,
        mouse: () => mouse,
        perpendicular: () => perpendicular,
        point: () => point5,
        pointAxialSymmetry: () => pointAxialSymmetry,
        pointCentralSymmetry: () => pointCentralSymmetry,
        pointOnCircle: () => pointOnCircle,
        pointOnLine: () => pointOnLine,
        pointOnObject: () => pointOnObject,
        pointOnPerpendicular: () => pointOnPerpendicular,
        pointType: () => pointType,
        polygon: () => polygon2,
        polygonType: () => polygonType,
        randomPoint: () => randomPoint,
        regularPolygon: () => regularPolygon,
        scalar: () => scalar2,
        scalarType: () => scalarType,
        segment: () => segment2,
        segmentBissector: () => segmentBissector,
        segmentFromPointVector: () => segmentFromPointVector,
        segmentFromPoints: () => segmentFromPoints,
        segmentFromVector: () => segmentFromVector,
        segmentType: () => segmentType,
        selectInCircle: () => selectInCircle,
        untyped: () => untyped,
        updateObject: () => updateObject,
        vector: () => vector2,
        vectorType: () => vectorType
      });

      // src/gui/Stage.js
      class Stage2 {
        constructor(canvas, params) {
          const props = Object.assign({
            window: index2.Rectangle.makeArea(-1.2, 1.2, 1.2, -1.2)
          }, params);
          this.canvas = canvas;
          this.ctx = this.canvas.getContext("2d");
          this.window = props.window;
          this.scale = new index2.Vector2(1, 1);
          this.translation = new index2.Vector2();
          this.computeTransform();
          this.items = [];
        }
        clear() {
          this.ctx.clearRect(0, 0, this.width, this.height);
        }
        add(...items) {
          items.forEach((item) => {
            if (this.items.indexOf(item) !== -1) {
              return;
            }
            if (item.output) {
              if (Array.isArray(item.output)) {
                this.add(...item.output);
              } else {
                this.add(...Object.values(item.output));
              }
            } else {
              this.items.push(item);
            }
          });
        }
        remove(...items) {
          items.forEach((item) => {
            const id = this.items.indexOf(item);
            if (id !== -1) {
              this.items.splice(id, 1);
            }
          });
        }
        computeTransform() {
          const sx = this.width / this.window.width;
          const sy = this.height / this.window.height;
          this.scale.set(sx, sy);
          this.translation.set(-this.window.x * this.scale.x, -this.window.y * this.scale.y);
        }
        _drawItems(items, frameId) {
          items.forEach((item) => {
            if (Array.isArray(item)) {
              this._drawItems(item, frameId);
            } else {
              updateObject(item, frameId);
              item.drawingFunc(this, item);
            }
          });
        }
        domToWindowCoords(v) {
          return v.sub(this.translation).divide(this.scale);
        }
        windowToDomCoords(v, result = new index2.Vector2()) {
          return v.multiply(this.scale).sub(this.translation);
        }
        draw(frameId) {
          this.computeTransform();
          this._drawItems(this.items, frameId);
        }
        get width() {
          return this.canvas.width;
        }
        get height() {
          return this.canvas.height;
        }
      }

      // src/utils/polyfills.js
      window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(fn) {
        return setTimeout(fn, 50 / 3);
      };
      window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || function(id) {
        clearTimeout(id);
      };
      if (!Function.prototype.bind) {
        console.log("prototo");
        Function.prototype.bind = function(scope) {
          if (!method)
            throw new Error("no method specified");
          var args = Array.prototype.slice.call(arguments, 2);
          return function() {
            var params = Array.prototype.slice.call(arguments);
            method.apply(scope, params.concat(args));
          };
        };
      }
      if (window.console === void 0 || console.log === void 0) {
        window.console = {
          log: function() {
          }
        };
      }
      const default2 = {};

      // src/utils/Signal.js
      class Listener {
        constructor(signal, callback, scope, args) {
          this.callback = callback;
          this.scope = scope;
          this.args = args;
          this.once = false;
          this.executed = false;
        }
        exec(args) {
          this.callback.apply(this.scope, args.concat(this.args));
        }
      }
      class Signal2 {
        constructor() {
          this.listeners = [];
        }
        add(callback, scope) {
          if (callback === void 0) {
            throw new Error("no callback specified");
          }
          let n = this.listeners.length;
          for (let i = 0; i < n; i++) {
            let listener2 = this.listeners[i];
            if (listener2.callback === callback && listener2.scope === scope) {
              return listener2;
            }
          }
          let args = Array.prototype.slice.call(arguments, 2);
          let listener = new Listener(this, callback, scope, args);
          this.listeners.unshift(listener);
          return listener;
        }
        addOnce(callback, scope) {
          let listener = this.add.apply(this, arguments);
          listener.once = true;
          return listener;
        }
        remove(callback, scope) {
          let n = this.listeners.length;
          for (let i = 0; i < n; i++) {
            let listener = this.listeners[i];
            if (listener.callback == callback && listener.scope == scope) {
              this.listeners.splice(i, 1);
              return;
            }
          }
        }
        removeListener(listener) {
          let id = this.listeners.indexOf(listener);
          if (id !== -1) {
            this.listeners.splice(id, 1);
          }
        }
        dispatch() {
          let args = Array.prototype.slice.call(arguments);
          let i = this.listeners.length;
          while (i--) {
            let listener = this.listeners[i];
            if (listener === void 0 || listener.executed) {
              continue;
            }
            if (listener.once) {
              this.listeners.splice(i, 1);
            }
            listener.exec(args);
            listener.executed = true;
          }
          i = this.listeners.length;
          while (i--) {
            let listener = this.listeners[i];
            if (listener === void 0) {
              this.listeners.splice(i, 1);
            } else {
              listener.executed = false;
            }
          }
        }
        dispose() {
          this.listeners = [];
        }
      }

      // src/utils/Mouse.js
      function getNumericStyleProperty(style, prop) {
        return parseInt(style.getPropertyValue(prop), 10);
      }
      function elementPosition(e) {
        var x = 0, y = 0;
        var inner = true;
        do {
          x += e.offsetLeft;
          y += e.offsetTop;
          var style = window.getComputedStyle(e, null);
          var borderTop = getNumericStyleProperty(style, "border-top-width");
          var borderLeft = getNumericStyleProperty(style, "border-left-width");
          y += borderTop;
          x += borderLeft;
          if (inner) {
            var paddingTop = getNumericStyleProperty(style, "padding-top");
            var paddingLeft = getNumericStyleProperty(style, "padding-left");
            y += paddingTop;
            x += paddingLeft;
          }
          inner = false;
        } while (Boolean(e = e.offsetParent));
        return {
          x,
          y
        };
      }
      class Mouse5 {
        constructor(target) {
          this.x = this.y = 0;
          this.isDown = false;
          this.isRightDown = false;
          this.target = target || document;
          this.onDown = new Signal2();
          this.onUp = new Signal2();
          this.onDrag = new Signal2();
          this.onMiddleDown = new Signal2();
          this.onMiddleDrag = new Signal2();
          this.onMiddleUp = new Signal2();
          this.onRightDown = new Signal2();
          this.onRightDrag = new Signal2();
          this.onRightUp = new Signal2();
          this.onMove = new Signal2();
          this.onWheel = new Signal2();
          this._moveBind = this._onMouseMove.bind(this);
          this._downBind = this._onMouseDown.bind(this);
          this._upBind = this._onMouseUp.bind(this);
          this._wheelBind = this._onMouseWheel.bind(this);
          this._contextBind = (e) => {
            e.preventDefault();
            return false;
          };
          this._enabled = false;
          this.enable();
        }
        enable() {
          if (this._enabled) {
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
          if (this.isDown) {
            this.onDrag.dispatch();
          }
          if (this.isMiddleDown) {
            this.onMiddleDrag.dispatch();
          }
          if (this.isRightDown) {
            this.onRightDrag.dispatch();
          }
        }
        _onMouseDown(e) {
          switch (e.which) {
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
          switch (e.which) {
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
          if (event.wheelDelta !== void 0) {
            delta = event.wheelDelta;
          } else if (event.detail !== void 0) {
            delta = -event.detail;
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

      // src/gui/Mouse.js
      class Mouse2 {
        constructor(stage2) {
          this.stage = stage2;
          this.mouseInput = new Mouse5(this.stage.canvas);
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
          this.position = new Vector25();
          this.enable();
        }
        enable() {
          this.onMove.add(this.updatePosition, this);
        }
        disable() {
          this.onMove.remove(this.updatePosition, this);
        }
        updatePosition() {
          this.stage.domToWindowCoords(this.position.copy(this.mouseInput));
        }
        get x() {
          return this.position.x;
        }
        get y() {
          return this.position.y;
        }
      }

      // src/gui/commands/SelectOrCreatePoint.js
      class SelectOrCreatePoint2 {
        constructor(stage2, mouse5) {
          this.stage = stage2;
          this.mouse = mouse5;
          this.selectionCircle = new index2.Circle(void 0, 5);
          this.completed = new Signal2();
        }
        enable() {
          this.mouse.onUp.add(this.onClick, this);
        }
        disable() {
          this.mouse.onUp.remove(this.onClick, this);
        }
        onClick() {
          this.selectionCircle.center.copy(this.mouse);
          this.selectionCircle.radius = 10 / Math.abs(this.stage.scale.x);
          let selection2 = index.selectInCircle(this.stage.items, this.selectionCircle);
          if (selection2.length === 0) {
            this.point = index.point(this.selectionCircle.center.x, this.selectionCircle.center.y);
            this.pointCreated = true;
          } else {
            const points = selection2.filter((item) => item.object.type === index.pointType);
            if (points.length > 0) {
              selection2 = points;
            }
            selection2.sort((a, b) => Math.abs(b.distance) - Math.abs(a.distance));
            const closestObject = selection2[0].object;
            this.point = index.pointOnObject(closestObject, this.selectionCircle.center);
            this.pointCreated = closestObject.type !== index.pointType;
          }
          if (this.pointCreated) {
            this.stage.add(this.point);
          }
          this.completed.dispatch(this.point, this.pointCreated);
        }
        cancel() {
        }
        undo() {
          if (this.pointCreated) {
            this.stage.remove(this.point);
          }
        }
        redo() {
          if (this.pointCreated) {
            this.stage.add(this.point);
          }
        }
      }

      // src/gui/commands/CircleCenterPoint.js
      class CircleCenterPoint3 {
        constructor(stage2, mouse5) {
          this.completed = new Signal2();
          this.stage = stage2;
          this.mouse = mouse5;
        }
        enable() {
          this.centerCommand = new SelectOrCreatePoint2(this.stage, this.mouse);
          this.centerCommand.enable();
          this.centerCommand.completed.add(this.onCenter, this);
          this.pointCommand = this.centerCommand;
        }
        disable() {
          this.centerCommand.completed.remove(this.onCenter, this);
          if (this.pointCommand) {
            this.pointCommand.completed.remove(this.onPoint, this);
          }
          this.pointCommand.disable();
        }
        onCenter(center) {
          this.center = center;
          this.tempPoint = index.mouse(this.stage, this.mouse);
          this.tempCircle = index.circle(this.center, this.tempPoint);
          this.tempCircle.selectable = false;
          this.center.selectable = false;
          this.tempPoint.selectable = false;
          this.stage.add(this.tempCircle);
          this.stage.add(this.tempPoint);
          this.centerCommand.completed.remove(this.onCenter, this);
          this.centerCommand.disable();
          this.pointCommand = new SelectOrCreatePoint2(this.stage, this.mouse);
          this.pointCommand.enable();
          this.pointCommand.completed.add(this.onPoint, this);
          this.pointCommand = this.pointCommand;
        }
        onPoint(point9) {
          this.point = point9;
          this.pointCommand.completed.remove(this.onCenter, this);
          this.pointCommand.disable();
          this.stage.remove(this.tempPoint);
          this.stage.remove(this.tempCircle);
          this.circle = index.circle(this.center, this.point);
          this.stage.add(this.circle);
          this.center.selectable = true;
          this.point.selectable = true;
          this.completed.dispatch(this.circle);
        }
        cancel() {
          if (this.center) {
            this.centerCommand.undo();
            this.stage.remove(this.tempCircle);
            this.pointCommand.completed.remove(this.onCenter, this);
            this.pointCommand.disable();
          }
        }
        undo() {
          this.centerCommand.undo();
          this.pointCommand.undo();
          this.stage.remove(this.circle);
        }
        redo() {
          this.centerCommand.redo();
          this.pointCommand.redo();
          this.stage.add(this.circle);
        }
      }

      // src/gui/commands/LinePointPoint.js
      class LinePointPoint3 {
        constructor(stage2, mouse5) {
          this.completed = new Signal2();
          this.stage = stage2;
          this.mouse = mouse5;
        }
        enable() {
          this.p1Command = new SelectOrCreatePoint2(this.stage, this.mouse);
          this.p1Command.enable();
          this.p1Command.completed.add(this.onP1, this);
          this.pointCommand = this.p1Command;
        }
        disable() {
          this.p1Command.completed.remove(this.onP1, this);
          if (this.p2Command) {
            this.p2Command.completed.remove(this.onP2, this);
          }
          this.pointCommand.disable();
        }
        onP1(p1) {
          this.p1 = p1;
          this.tempP2 = index.mouse(this.stage, this.mouse);
          this.tempLine = index.line(this.p1, this.tempP2);
          this.tempLine.selectable = false;
          this.p1.selectable = false;
          this.tempP2.selectable = false;
          this.stage.add(this.tempLine);
          this.stage.add(this.tempP2);
          this.p1Command.completed.remove(this.onP1, this);
          this.p1Command.disable();
          this.p2Command = new SelectOrCreatePoint2(this.stage, this.mouse);
          this.p2Command.enable();
          this.p2Command.completed.add(this.onP2, this);
          this.pointCommand = this.p2Command;
        }
        onP2(p2) {
          this.p2 = p2;
          this.p2Command.completed.remove(this.onP2, this);
          this.p2Command.disable();
          this.stage.remove(this.tempP2);
          this.stage.remove(this.tempLine);
          this.line = index.line(this.p1, this.p2);
          this.stage.add(this.line);
          this.p1.selectable = true;
          this.p2.selectable = true;
          this.completed.dispatch(this.line);
        }
        cancel() {
          if (this.p1) {
            this.p1Command.undo();
            this.stage.remove(this.tempLine);
            this.p2Command.completed.remove(this.onP1, this);
            this.p2Command.disable();
          }
        }
        undo() {
          this.p1Command.undo();
          this.p2Command.undo();
          this.stage.remove(this.line);
        }
        redo() {
          this.p1Command.redo();
          this.p2Command.redo();
          this.stage.add(this.line);
        }
      }

      // src/gui/commands/DragPoint.js
      class DragPoint3 {
        constructor(stage2, mouse5) {
          this.stage = stage2;
          this.mouse = mouse5;
          this.selectionCircle = new index2.Circle(void 0, 5);
          this.completed = new Signal2();
          this.originalPos = new index2.Vector2();
          this.resultPos = new index2.Vector2();
          this.target = void 0;
        }
        enable() {
          this.mouse.onDown.add(this.onDown, this);
        }
        disable() {
          this.mouse.onDown.remove(this.onDown, this);
          this.mouse.onUp.remove(this.onUp, this);
          this.mouse.onMove.remove(this.onMove, this);
        }
        onDown() {
          this.selectionCircle.center.copy(this.mouse);
          this.selectionCircle.radius = 10 / Math.abs(this.stage.scale.x);
          const points = index.selectInCircle(this.stage.items, this.selectionCircle).filter((item) => {
            const isPoint = item.object.type === index.pointType;
            const isDraggable = !item.input;
            return isPoint && isDraggable;
          });
          points.sort((a, b) => Math.abs(b.distance) - Math.abs(a.distance));
          if (points.length > 0) {
            this.startDrag(points[0].object);
          }
        }
        startDrag(target) {
          this.target = target;
          this.originalPos.copy(this.target.geom);
          this.mouse.onMove.add(this.onMove, this);
          this.mouse.onUp.add(this.onUp, this);
        }
        onUp() {
          this.resultPos.copy(this.target.geom);
          this.mouse.onMove.remove(this.onMove, this);
          this.mouse.onUp.remove(this.onUp, this);
          this.completed.dispatch();
        }
        onMove() {
          this.target.geom.copy(this.mouse);
        }
        cancel() {
        }
        undo() {
          this.target.geom.copy(this.originalPos);
        }
        redo() {
          this.target.geom.copy(this.resultPos);
        }
      }

      // src/utils/Loop.js
      class Loop2 {
        constructor(callback, scope, autoPlay) {
          this.onUpdate = new Signal2();
          this.isPaused = true;
          this.frameId = 0;
          if (callback) {
            this.onUpdate.add(callback, scope);
            if (autoPlay || autoPlay === void 0) {
              this.play();
            }
          }
        }
        play() {
          if (!this.isPaused)
            return;
          this.isPaused = false;
          this._onUpdate();
        }
        _onUpdate() {
          this.onUpdate.dispatch(this.frameId);
          if (!this.isPaused) {
            this._requestFrame = requestAnimationFrame(this._onUpdate.bind(this));
          }
          this.frameId++;
        }
        pause() {
          this.isPaused = true;
          cancelAnimationFrame(this._requestFrame);
        }
        dispose() {
          this.onUpdate.dispose();
          this.pause();
        }
      }

      // src/gui/commands/DragStage.js
      class DragStage3 {
        constructor(stage2, mouse5) {
          this.completed = new Signal2();
          this.stage = stage2;
          this.window = this.stage.window;
          this.mouse = mouse5;
          this.mouseLastPos = new index2.Vector2();
          this.mouseBeginPos = new index2.Vector2();
          this.windowBeginPos = new index2.Vector2();
          this.friction = 0.9;
          this.vel = new index2.Vector2();
          this.moveLoop = new Loop2(this.onMoveRelease, this, false);
        }
        startDrag() {
          this.moveLoop.pause();
          this.mouse.onMove.add(this.onDrag, this);
          this.mouseLastPos.copy(this.mouse.mouseInput);
          this.mouseBeginPos.copy(this.mouse.mouseInput);
          this.windowBeginPos.copy(this.window);
          this.mouse.mouseInput.setCursor("grabbing");
        }
        stopDrag() {
          this.mouse.onMove.remove(this.onDrag, this);
          this.mouse.mouseInput.setCursor("grab");
          this.moveLoop.play();
        }
        onDrag() {
          let tmp = index2.Vector2.create();
          let mouseDiff = tmp.copy(this.mouse.mouseInput).sub(this.mouseBeginPos).divide(this.stage.scale).multiplyScalar(-1);
          let t = mouseDiff.add(this.windowBeginPos);
          this.window.x = t.x;
          this.window.y = t.y;
          this.vel.copy(this.mouse.mouseInput).sub(this.mouseLastPos);
          this.mouseLastPos.copy(this.mouse.mouseInput);
          tmp.dispose();
        }
        onMoveRelease() {
          this.vel.multiplyScalar(this.friction);
          let v = this.vel.clone().divide(this.stage.scale).multiplyScalar(-1);
          this.window.x += v.x;
          this.window.y += v.y;
          if (this.vel.getLength() < 0.01) {
            this.moveLoop.pause();
          }
          v.dispose();
        }
        enable() {
          this.mouse.onDown.add(this.startDrag, this);
          this.mouse.onUp.add(this.stopDrag, this);
          this.mouse.mouseInput.setCursor("grab");
        }
        disable() {
          this.mouse.onDown.remove(this.startDrag, this);
          this.mouse.onUp.remove(this.stopDrag, this);
          this.mouse.onMove.remove(this.onDrag, this);
          this.mouse.mouseInput.setCursor("default");
          this.moveLoop.pause();
        }
      }

      // src/gui/commands/index.js
      var index3 = {};
      __export(index3, {
        CircleCenterPoint: () => CircleCenterPoint3,
        DragPoint: () => DragPoint3,
        DragStage: () => DragStage3,
        LinePointPoint: () => LinePointPoint3,
        SelectOrCreatePoint: () => SelectOrCreatePoint2
      });

      // src/gui/Tool.js
      class Tool2 {
        constructor(stage2, mouse5, commandClass, description, icon) {
          this.stage = stage2;
          this.mouse = mouse5;
          this.commandClass = commandClass;
          this.description = description;
          this.icon = icon;
          this.commandCompleted = new Signal2();
        }
        enable() {
          this.startCommand();
        }
        disable() {
          this.currentCommand.disable();
        }
        startCommand() {
          this.currentCommand = new this.commandClass(this.stage, this.mouse);
          this.currentCommand.completed.add(this.onCommandComplete, this);
          this.currentCommand.enable();
        }
        onCommandComplete() {
          this.currentCommand.completed.remove(this.onCommandComplete, this);
          this.commandCompleted.dispatch(this.currentCommand);
          this.currentCommand.disable();
          this.startCommand();
        }
        cancel() {
          this.currentCommand.cancel();
        }
      }

      // src/gui/ToolsSelector.js
      class ToolsSelector2 {
        constructor(tools) {
          this.domElement = document.createElement("ul");
          this.domElement.classList.add("toolsSelector");
          this.tools = tools;
          this.onClickBind = this.onClick.bind(this);
          this.setCurrentTool(this.tools[0]);
        }
        enable() {
          this.domElement.addEventListener("click", this.onClickBind);
        }
        disable() {
          this.domElement.removeEventListener("click", this.onClickBind);
        }
        buildList() {
          this.tools.forEach((tool, i) => {
            const container = document.createElement("li");
            container.classList.add("tool");
            this.domElement.appendChild(container);
            const element = document.createElement("button");
            element.innerHTML = tool.description;
            element.dataset.id = i;
            container.appendChild(element);
          });
        }
        onClick(evt) {
          let id = parseInt(evt.target.dataset.id);
          this.setCurrentTool(this.tools[id]);
        }
        setCurrentTool(tool) {
          if (this.currentTool !== void 0) {
            this.currentTool.disable();
          }
          this.currentTool = tool;
          this.currentTool.enable();
        }
      }

      // src/gui/CompleteGui.js
      class CompleteGui2 {
        constructor(props) {
          props = Object.assign({
            updateCallback: () => {
            },
            width: 700,
            height: 700,
            autoStart: true,
            autoSize: true
          }, props);
          if (props.canvas === void 0) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = props.width;
            this.canvas.height = props.height;
          } else {
            this.canvas = props.canvas;
          }
          this.updateCallback = props.updateCallback;
          this.window = index2.Rectangle.makeArea(-1.2, 1.2, 1.2, -1.2);
          this.stage = new Stage2(this.canvas, {
            window: this.window.clone()
          });
          this.mouseController = new Mouse2(this.stage);
          this.mouse = index.mouse(this.stage, this.mouseController);
          let radius = index.scalar(10 / Math.abs(this.stage.scale.x));
          this.mouseCircle = index.circle(this.mouse, radius);
          this.mouseCircle.selectable = false;
          this.stage.add(this.mouseCircle);
          let selector = new ToolsSelector2([new Tool2(this.stage, this.mouseController, index3.DragPoint, "drag point", "icon"), new Tool2(this.stage, this.mouseController, index3.LinePointPoint, "create line", "icon"), new Tool2(this.stage, this.mouseController, index3.CircleCenterPoint, "create circle", "icon"), new Tool2(this.stage, this.mouseController, index3.DragStage, "drag", "icon")]);
          selector.buildList();
          selector.enable();
          this.domElement = document.createElement("div");
          this.domElement.appendChild(this.canvas);
          this.domElement.appendChild(selector.domElement);
          if (props.autoStart) {
            this.start();
          }
          if (props.autoSize) {
            this.autoSize();
            window.onload = () => {
              this.onAutoSize();
              window.onload = null;
            };
          }
        }
        ranPt() {
          return index.randomPoint(this.stage.window);
        }
        start() {
          if (this.isPlaying) {
            return;
          }
          this.isPlaying = true;
          this.update();
        }
        pause() {
          this.isPlaying = false;
        }
        update() {
          let timeStamp = Date.now();
          this.updateCallback(timeStamp);
          this.mouseCircle.input.radius.value = 10 / Math.abs(this.stage.scale.x);
          let w = this.stage.window;
          this.stage.clear();
          this.stage.draw(timeStamp);
          if (this.isPlaying) {
            requestAnimationFrame(this.update.bind(this));
          }
        }
        autoSize() {
          let ds = this.domElement.style;
          let cs = this.canvas.style;
          cs.width = ds.width = "100%";
          cs.height = ds.height = "100%";
          window.addEventListener("resize", () => this.onAutoSize());
        }
        onAutoSize() {
          this.resize(this.domElement.clientWidth, this.domElement.clientHeight);
        }
        resize(w, h) {
          this.canvas.width = w;
          this.canvas.height = h;
          const stageRatio = w / h;
          const windowRatio = Math.abs(this.window.width / this.window.height);
          this.stage.window.copy(this.window);
          let vw, vh;
          if (stageRatio > windowRatio) {
            vw = this.window.width * stageRatio / windowRatio;
            vh = this.window.height;
          } else {
            vw = this.window.width;
            vh = this.window.height / (stageRatio / windowRatio);
          }
          this.stage.window.set(this.window.x + 0.5 * this.window.width - 0.5 * vw, this.window.y + 0.5 * this.window.height - 0.5 * vh, vw, vh);
        }
      }

      // src/index.js
      const gui = new CompleteGui2();
      document.body.appendChild(gui.domElement);
      const stage = gui.stage;
      gui.window.setCorners(-10, 10, 10, -10);
      let origin = index.point(0, 0);
      stage.add(index.vector(origin, index.point(1, 0)));
      stage.add(index.vector(origin, index.point(0, 1)));
      gui.start();
    }
  };
  return __require(26);
})();
//# sourceMappingURL=app.js.map

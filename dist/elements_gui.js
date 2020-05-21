(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.updateObjects = updateObjects;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function updateObjects(objects, timeStamp) {
  for (var k in objects) {
    var obj = objects[k];
    if (Array.isArray(obj)) {
      obj.forEach(function (obj) {
        return updateObjects(obj, timeStamp);
      });
    } else if (obj.construction !== undefined) {
      obj.construction.update(timeStamp);
    }
  }
}

var Construction = exports.Construction = function () {
  function Construction(params) {
    _classCallCheck(this, Construction);

    this.description = params.description;
    this.src = params.src;
    this.result = params.result;
    this.helpers = params.helpers;
    this.updateFunction = params.updateFunction;

    this.timeStamp = -1;
  }

  _createClass(Construction, [{
    key: "update",
    value: function update(timeStamp) {
      if (timeStamp === this.timeStamp) {
        return;
      }
      this.timeStamp = timeStamp;

      updateObjects(this.src, timeStamp);
      updateObjects(this.helpers, timeStamp);
      this.updateFunction(this.src, this.result, this.helpers, timeStamp);
    }
  }]);

  return Construction;
}();

var defaultConstruction = exports.defaultConstruction = new Construction({
  src: {},
  result: {},
  description: "free construction",
  updateFunction: function updateFunction(src, result) {}
});

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.origin = exports.types = undefined;

var _maths = require("../maths");

var maths = _interopRequireWildcard(_maths);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var types = exports.types = {};

var origin = exports.origin = new maths.Vector2(0, 0);

},{"../maths":35}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseCircle = baseCircle;
exports.circle = circle;
exports.circleFromCenterPoint = circleFromCenterPoint;
exports.circleFromCenterRadius = circleFromCenterRadius;
exports.circumCircle = circumCircle;
exports.circleAxialSymmetry = circleAxialSymmetry;
exports.circleCentralSymmetry = circleCentralSymmetry;

var _drawing = require("../gui/graphics/drawing");

var _Style = require("../gui/graphics/Style");

var _Style2 = _interopRequireDefault(_Style);

var _maths = require("../maths");

var maths = _interopRequireWildcard(_maths);

var _index = require("./index");

var api = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

api.types.circle = "circle";

function baseCircle() {
  return {
    type: api.types.circle,
    style: new _Style2.default({ stroke: "black" }),
    drawingFunc: _drawing.drawCircle,
    geom: new maths.Circle()
  };
}

function circle() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 3) {
    return circumCircle.apply(undefined, args);
  } else if (args[1].type === api.types.point) {
    return circleFromCenterPoint.apply(undefined, args);
  } else if (args[1].type !== api.types.scalar) {
    return circleFromCenterRadius(args[0], api.scalar(args[1]));
  } else {
    return circleFromCenterRadius(args[0], args[1]);
  }
}

function circleFromCenterPoint(center, point) {
  var circle = baseCircle();
  Object.assign(circle, {
    center: center,
    construction: new api.Construction({
      description: "Circle from (center, point)",
      src: { center: center, point: point },
      result: circle,
      updateFunction: function updateFunction(src, result) {
        var c = result.geom;
        c.center.copy(src.center.geom);
        c.radius = maths.Vector2.dist(c.center, src.point.geom);
      }
    })
  });
  return circle;
}

function circleFromCenterRadius(center, radius) {
  var circle = baseCircle();
  radius = api.scalar(radius);
  Object.assign(circle, {
    center: center, radius: radius,
    construction: new api.Construction({
      description: "Circle from (center, radius)",
      src: { center: center, radius: radius },
      result: circle,
      updateFunction: function updateFunction(src, result) {
        var c = result.geom;
        c.center.copy(src.center.geom);
        c.radius = src.radius.value;
      }
    })
  });
  return circle;
}

function circumCircle(p1, p2, p3) {
  var circle = baseCircle();
  var center = api.circumCenter(p1, p2, p3);
  Object.assign(circle, {
    center: center,
    p1: p1, p2: p2, p3: p3,
    construction: new api.Construction({
      description: "circum circle",
      src: { p1: p1, p2: p2, p3: p3 },
      result: circle,
      helpers: { center: center },
      updateFunction: function updateFunction(src, result, helpers) {
        var center = helpers.center;
        var circle = result.geom;
        circle.center.copy(center.geom);
        circle.radius = maths.Vector2.dist(center.geom, src.p1.geom);
      }
    })
  });
  return circle;
}

function circleAxialSymmetry(c, axis) {
  var circle = baseCircle();
  Object.assign(circle, {
    construction: new api.Construction({
      description: "circle axial symmetry",
      src: { c: c, axis: axis },
      result: circle,
      updateFunction: function updateFunction(src, result) {
        result.geom.copy(src.c.geom);
        maths.circleAxialSymmetry(result.geom, src.axis.geom);
      }
    })
  });
  return circle;
}

function circleCentralSymmetry(c, center) {
  var circle = baseCircle();
  Object.assign(circle, {
    construction: new api.Construction({
      description: "circle central symmetry",
      src: { c: c, center: center },
      result: circle,
      updateFunction: function updateFunction(src, result) {
        result.geom.copy(src.c.geom);
        maths.circleCentralSymmetry(result.geom, src.center.geom);
      }
    })
  });
  return circle;
}

},{"../gui/graphics/Style":26,"../gui/graphics/drawing":27,"../maths":35,"./index":5}],4:[function(require,module,exports){
"use strict";

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require("./api");

Object.keys(_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _api[key];
    }
  });
});

var _Construction = require("./Construction");

Object.keys(_Construction).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Construction[key];
    }
  });
});

var _point = require("./point");

Object.keys(_point).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _point[key];
    }
  });
});

var _line = require("./line");

Object.keys(_line).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _line[key];
    }
  });
});

var _circle = require("./circle");

Object.keys(_circle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _circle[key];
    }
  });
});

var _segment = require("./segment");

Object.keys(_segment).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _segment[key];
    }
  });
});

var _functionGraph = require("./functionGraph");

Object.keys(_functionGraph).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _functionGraph[key];
    }
  });
});

var _scalar = require("./scalar");

Object.keys(_scalar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _scalar[key];
    }
  });
});

var _vector = require("./vector");

Object.keys(_vector).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _vector[key];
    }
  });
});

var _polygon = require("./polygon");

Object.keys(_polygon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _polygon[key];
    }
  });
});

var _selection = require("./selection");

Object.keys(_selection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _selection[key];
    }
  });
});

},{"./Construction":1,"./api":2,"./circle":3,"./functionGraph":4,"./line":6,"./point":7,"./polygon":8,"./scalar":9,"./segment":10,"./selection":11,"./vector":12}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseLine = baseLine;
exports.line = line;
exports.lineFromPoints = lineFromPoints;
exports.lineFromPointVector = lineFromPointVector;
exports.perpendicular = perpendicular;
exports.segmentBissector = segmentBissector;

var _drawing = require("../gui/graphics/drawing");

var _Style = require("../gui/graphics/Style");

var _Style2 = _interopRequireDefault(_Style);

var _maths = require("../maths");

var maths = _interopRequireWildcard(_maths);

var _index = require("./index");

var api = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

api.types.line = "line";

function baseLine() {
  return {
    type: api.types.line,
    style: new _Style2.default(),
    drawingFunc: _drawing.drawLine,
    geom: new maths.Line()
  };
}

function line(a, b) {
  var t = api.types;
  if (a.type === t.point && b.type === t.point) {
    return lineFromPoints(a, b);
  } else if (a.type === t.point && b.type === t.vector) {
    return lineFromPointVector();
  }

  if (!Number.isNaN(a)) {
    a = api.scalar(a);
  }
  if (!Number.isNaN(b)) {
    b = api.scalar(b);
  }

  if (a.type === t.point && b.type === t.scalar) {
    throw new Error("not implemented yet");
  } else if (a.type === t.vector && b.type === t.scalar) {
    throw new Error("not implemented yet");
  } else if (a.type === t.scalar && b.type === t.scalar) {
    throw new Error("not implemented yet");
  } else {
    throw new Error("no line constructor for given params : " + a + ", " + b);
  }
}

function lineFromPoints(p1, p2) {
  var line = baseLine();
  line.construction = new api.Construction({
    description: "line from points",
    src: { p1: p1, p2: p2 },
    result: line,
    updateFunction: function updateFunction(src, result) {
      var l = result.geom;
      l.point.copy(src.p1.geom);
      l.vector.copy(src.p2.geom).sub(src.p1.geom);
    }
  });
  return line;
}

function lineFromPointVector(point, vector) {
  var line = baseLine();
  line.construction = new api.Construction({
    description: "line from (point, vector)",
    src: { point: point, vector: vector },
    result: line,
    updateFunction: function updateFunction(src, result) {
      result.geom.set(src.point.geom, src.vector.geom);
    }
  });
  return line;
}

function perpendicular(line, point) {
  return lineFromPoints(point, api.pointOnPerpendicular(line, point));
}

function segmentBissector(segment) {
  var line = baseLine();
  line.construction = new api.Construction({
    description: "segment bissector",
    src: { segment: segment },
    result: line,
    updateFunction: function updateFunction(src, result) {
      var p1 = src.segment.geom.p1;
      var p2 = src.segment.geom.p2;
      var line = result.geom;
      line.point.lerp(p1, p2, 0.5);
      line.vector.set(p1.y - p2.y, p2.x - p1.x);
    }
  });
  return line;
}

},{"../gui/graphics/Style":26,"../gui/graphics/drawing":27,"../maths":35,"./index":5}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basePoint = basePoint;
exports.point = point;
exports.randomPoint = randomPoint;
exports.middle = middle;
exports.pointOnPerpendicular = pointOnPerpendicular;
exports.circumCenter = circumCenter;
exports.lineCircleIntersections = lineCircleIntersections;
exports.circlesIntersections = circlesIntersections;
exports.linesIntersection = linesIntersection;
exports.pointOnObject = pointOnObject;
exports.pointOnLine = pointOnLine;
exports.pointOnCircle = pointOnCircle;
exports.mouse = mouse;
exports.pointCentralSymmetry = pointCentralSymmetry;
exports.pointAxialSymmetry = pointAxialSymmetry;

var _drawing = require("../gui/graphics/drawing");

var _Style = require("../gui/graphics/Style");

var _Style2 = _interopRequireDefault(_Style);

var _maths = require("../maths");

var maths = _interopRequireWildcard(_maths);

var _index = require("./index");

var api = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

api.types.point = "point";

function basePoint() {
  return {
    type: api.types.point,
    style: new _Style2.default({ fill: "black" }),
    drawingFunc: _drawing.drawPoint,
    geom: new maths.Vector2(),
    setCoords: function setCoords(x, y) {
      this.geom.set(x, y);
    }
  };
}

function point(x, y) {
  var pt = basePoint();
  pt.geom.set(x, y);
  pt.construction = api.defaultConstruction;
  return pt;
}

function randomPoint(area) {
  return api.point(area.x + Math.random() * area.width, area.y + Math.random() * area.height);
}

function middle(segment) {
  var pt = basePoint();
  pt.construction = new api.Construction({
    description: "segment middle",
    src: { segment: segment },
    result: pt,
    updateFunction: function updateFunction(src, result) {
      result.geom.lerp(src.segment.geom.p1, src.segment.geom.p2, 0.5);
    }
  });
  return pt;
}

function pointOnPerpendicular(line, point) {
  var pt = basePoint();
  pt.construction = new api.Construction({
    description: "point on perpendicular",
    src: { line: line, point: point },
    result: pt,
    updateFunction: function updateFunction(src, result) {
      var pt = src.point.geom;
      var v = src.line.geom.vector;
      result.geom.set(pt.x - v.y, pt.y + v.y);
    }
  });
  return pt;
}

function circumCenter(p1, p2, p3) {
  var l1 = api.segmentBissector(api.segment(p1, p2));
  var l2 = api.segmentBissector(api.segment(p1, p3));
  var pt = basePoint();
  pt.construction = new api.Construction({
    description: "circum center",
    src: { p1: p1, p2: p2, p3: p3 },
    result: pt,
    helpers: { l1: l1, l2: l2 },
    updateFunction: function updateFunction(src, result, helpers) {
      maths.linesIntersection(helpers.l1.geom, helpers.l2.geom, result.geom);
    }
  });
  return pt;
}

function lineCircleIntersections(line, circle) {
  var pts = [basePoint(), basePoint()];
  var construction = new api.Constructions({
    description: "line circle intersections",
    src: { line: line, circle: circle },
    result: pts,
    updateFunction: function updateFunction(src, result) {
      maths.lineCircleIntersection(src.line.geom, src.circle.geom, result[0].geom, result[1].geom);
    }
  });
  pts[0].construction = pts[1].construction = construction;
  return pts;
}

function circlesIntersections(c1, c2) {
  var pts = [basePoint(), basePoint()];
  var construction = new api.Construction({
    description: "circles intersections",
    src: { c1: c1, c2: c2 },
    result: pts,
    updateFunction: function updateFunction(src, result) {
      maths.circlesIntersections(src.c1.geom, src.c2.geom, result[0].geom, result[1].geom);
    }
  });
  pts[0].construction = pts[1].construction = construction;
  return pts;
}

function linesIntersection(l1, l2) {
  var pt = basePoint();
  pt.construction = new api.Construction({
    description: "lines intersection",
    src: { l1: l1, l2: l2 },
    result: pt,
    updateFunction: function updateFunction(src, result) {
      maths.linesIntersection(src.l1.geom, src.l2.geom, result.geom);
    }
  });
  return pt;
}

/**
 * position:Vector2 only used at creation
 */
function pointOnObject(obj, position) {
  switch (obj.type) {
    case api.types.point:
      return obj;
    case api.types.circle:
      return pointOnCircle(obj, position);
    case api.types.line:
      return pointOnLine(obj, position);
    default:
      throw new Error("no implementation for type : " + obj.type);
      break;
  }
}

function pointOnLine(line, position) {
  var pt = basePoint();
  pt.geom.copy(position);
  pt.construction = new api.Construction({
    description: "point on line",
    src: { line: line },
    result: pt,
    updateFunction: function updateFunction(src, result) {
      maths.projectVectorOnLine(result.geom, src.line.geom);
    }
  });
  return pt;
}

function pointOnCircle(circle, position) {
  var pt = basePoint();
  pt.geom.copy(position);
  pt.construction = new api.Construction({
    description: "point on circle",
    src: { circle: circle },
    result: pt,
    updateFunction: function updateFunction(src, result) {
      maths.projectVectorOnCircle(result.geom, src.circle.geom, result.geom);
    }
  });
  return pt;
}

function mouse(stage, mouse) {
  var pt = basePoint();
  Object.assign(pt, {
    selectable: false,
    construction: new api.Construction({
      description: "mouse",
      src: {},
      result: pt,
      updateFunction: function updateFunction(src, result) {
        result.geom.copy(mouse.position);
      }
    })
  });
  return pt;
}

function pointCentralSymmetry(point, center) {
  var pt = basePoint();
  Object.assign(pt, {
    selectable: false,
    construction: new api.Construction({
      description: "point central symmetry",
      src: { point: point, center: center },
      result: pt,
      updateFunction: function updateFunction(src, result) {
        maths.pointCentralSymmetry(result.geom.copy(src.point.geom), center);
      }
    })
  });
  return pt;
}

function pointAxialSymmetry(point, axis) {
  var pt = basePoint();
  Object.assign(pt, {
    selectable: false,
    construction: new api.Construction({
      description: "point axial symmetry",
      src: { point: point, axis: axis },
      result: pt,
      updateFunction: function updateFunction(src, result) {
        maths.pointaxialSymmetry(result.geom.copy(src.point.geom), axis);
      }
    })
  });
  return pt;
}

},{"../gui/graphics/Style":26,"../gui/graphics/drawing":27,"../maths":35,"./index":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basePolygon = basePolygon;
exports.polygon = polygon;

var _drawing = require("../gui/graphics/drawing");

var _Style = require("../gui/graphics/Style");

var _Style2 = _interopRequireDefault(_Style);

var _maths = require("../maths");

var maths = _interopRequireWildcard(_maths);

var _index = require("./index");

var api = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

api.types.polygon = "polygon";

function basePolygon(pts) {
  return {
    type: api.types.polygon,
    style: new _Style2.default({ stroke: "black" }),
    drawingFunc: _drawing.drawPolygon,
    geom: pts
  };
}

function polygon() {
  for (var _len = arguments.length, pts = Array(_len), _key = 0; _key < _len; _key++) {
    pts[_key] = arguments[_key];
  }

  if (Array.isArray(pts[0])) {
    pts = pts[0];
  }
  if (pts[0].type === api.types.point) {
    pts = pts.map(function (p) {
      return p.geom;
    });
  }
  console.log(pts);
  var poly = basePolygon(pts);
  poly.construction = api.defaultConstruction;
  return poly;
}

},{"../gui/graphics/Style":26,"../gui/graphics/drawing":27,"../maths":35,"./index":5}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scalar = scalar;

var _index = require("./index");

var api = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

api.types.scalar = "scalar";

function scalar(value) {
  return {
    type: api.types.scalar,
    value: value.type === api.types.scalar ? value.value : value
  };
}

},{"./index":5}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseSegment = baseSegment;
exports.segment = segment;
exports.segmentFromPoints = segmentFromPoints;
exports.segmentFromVector = segmentFromVector;
exports.segmentFromPointVector = segmentFromPointVector;

var _drawing = require("../gui/graphics/drawing");

var _Style = require("../gui/graphics/Style");

var _Style2 = _interopRequireDefault(_Style);

var _maths = require("../maths");

var maths = _interopRequireWildcard(_maths);

var _index = require("./index");

var api = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

api.types.segment = "segment";

function baseSegment() {
  return {
    type: api.types.segment,
    style: new _Style2.default({ stroke: "black" }),
    drawingFunc: _drawing.drawSegment,
    geom: new maths.Segment()
  };
}

function segment() {
  var t = api.types;

  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  if (params.length === 1 && params[0].type === t.vector) {
    return segmentFromVector(params[0]);
  } else if (params[0].type === t.point && params[1].type === t.point) {
    return segmentFromPoints(params[0], params[1]);
  } else if (params[0].type === t.point && params[1].type === t.vector) {
    return segmentFromPointVector(params[0], params[1]);
  } else {
    throw new Error("no line constructor for given params : " + params.join(", "));
  }
}

function segmentFromPoints(p1, p2) {
  var segment = baseSegment();
  Object.assign(segment, {
    construction: new api.Construction({
      description: "segment from points",
      src: { p1: p1, p2: p2 },
      result: segment,
      updateFunction: function updateFunction(src, result) {
        var s = result.geom;
        s.p1.copy(src.p1.geom);
        s.p2.copy(src.p2.geom);
      }
    })
  });
  return segment;
}

function segmentFromVector(vector) {
  var segment = baseSegment();
  Object.assign(segment, {
    construction: new api.Construction({
      description: "segment from vector",
      src: { vector: vector },
      result: segment,
      updateFunction: function updateFunction(src, result) {
        var s = result.geom;
        s.p1.copy(src.vector.p1.geom);
        s.p2.copy(src.vector.p2.geom);
      }
    })
  });
  return segment;
}

function segmentFromPointVector(point, vector) {
  var segment = baseSegment();
  Object.assign(segment, {
    construction: new api.Construction({
      description: "segment from point vector",
      src: { point: point, vector: vector },
      result: segment,
      updateFunction: function updateFunction(src, result) {
        var s = result.geom;
        var p = src.point.geom;
        s.copy(p);
        s.copy(p).add(src.vector.geom);
      }
    })
  });
  return segment;
}

},{"../gui/graphics/Style":26,"../gui/graphics/drawing":27,"../maths":35,"./index":5}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectInCircle = selectInCircle;

var _index = require("./index");

var api = _interopRequireWildcard(_index);

var _point = require("./point");

var point = _interopRequireWildcard(_point);

var _maths = require("../maths");

var maths = _interopRequireWildcard(_maths);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function selectInCircle(objects, circle) {
  var result = [];
  objects.forEach(function (object) {
    if (object.selectable === false) {
      return;
    }
    if (Array.isArray(object)) {
      result.push.apply(result, _toConsumableArray(selectInCircle(object, circle)));
    } else {
      var distance = void 0;
      switch (object.type) {
        case api.types.point:
          distance = maths.vectorsDistance(object.geom, circle.center);
          break;
        case api.types.line:
          distance = maths.vectorLineDistance(circle.center, object.geom);
          break;
        case api.types.circle:
          distance = maths.vectorCircleDistance(circle.center, object.geom);
          break;
        default:
          console.warn("type not handled : " + object.type);
          break;
      }
      result.push({ object: object, distance: distance });
    }
  });

  return result.filter(function (o) {
    return Math.abs(o.distance) < circle.radius;
  });
}

},{"../maths":35,"./index":5,"./point":7}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseVector = baseVector;
exports.vector = vector;

var _drawing = require("../gui/graphics/drawing");

var _Style = require("../gui/graphics/Style");

var _Style2 = _interopRequireDefault(_Style);

var _maths = require("../maths");

var maths = _interopRequireWildcard(_maths);

var _index = require("./index");

var api = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

api.types.vector = "vector";

function baseVector() {
  return {
    type: api.types.vector,
    style: new _Style2.default({ stroke: "black" }),
    drawingFunc: _drawing.drawVector,
    geom: new maths.Segment()
  };
}

function vector(p1, p2) {
  var vector = baseVector();
  vector.construction = new api.Construction({
    src: { p1: p1, p2: p2 },
    result: vector,
    updateFunction: function updateFunction(src, result) {
      var s = result.geom;
      s.p1.copy(src.p1.geom);
      s.p2.copy(src.p2.geom);
    }
  });
  return vector;
}

},{"../gui/graphics/Style":26,"../gui/graphics/drawing":27,"../maths":35,"./index":5}],13:[function(require,module,exports){
"use strict";

var _api = require("../api");

var api = _interopRequireWildcard(_api);

var _CompleteGui = require("../gui/CompleteGui");

var _CompleteGui2 = _interopRequireDefault(_CompleteGui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

api.gui = _CompleteGui2.default;
window.EE = api;

},{"../api":5,"../gui/CompleteGui":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require("../api");

var api = _interopRequireWildcard(_api);

var _Stage = require("./Stage");

var _Mouse = require("./Mouse");

var _Mouse2 = _interopRequireDefault(_Mouse);

var _commands = require("./commands");

var commands = _interopRequireWildcard(_commands);

var _Tool = require("./Tool");

var _ToolsSelector = require("./ToolsSelector");

var _ToolsSelector2 = _interopRequireDefault(_ToolsSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CompleteGui = function () {
  function CompleteGui(props) {
    var _this = this;

    _classCallCheck(this, CompleteGui);

    props = Object.assign({
      updateCallback: function updateCallback() {},
      width: 700,
      height: 700,
      autoStart: true,
      autoSize: true
    }, props);

    if (props.canvas === undefined) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = props.width;
      this.canvas.height = props.height;
    } else {
      this.canvas = props.canvas;
    }

    this.updateCallback = props.updateCallback;

    this.stage = new _Stage.Stage(this.canvas);

    this.mouse = new _Mouse2.default(this.stage);
    var m = api.mouse(this.stage, this.mouse);

    var radius = 10 / Math.abs(this.stage.scale.x);
    var cm = api.circle(m, radius);
    cm.selectable = false;
    this.stage.add(cm);

    var selector = new _ToolsSelector2.default([new _Tool.Tool(this.stage, this.mouse, commands.DragPoint, "drag point", "icon"), new _Tool.Tool(this.stage, this.mouse, commands.LinePointPoint, "create line", "icon"), new _Tool.Tool(this.stage, this.mouse, commands.CircleCenterPoint, "create circle", "icon"), new _Tool.Tool(this.stage, this.mouse, commands.DragStage, "drag", "icon")]);
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
      window.onload = function () {
        _this.onAutoSize();
        window.onload = null;
      };
    }
  }

  _createClass(CompleteGui, [{
    key: "ranPt",
    value: function ranPt() {
      return api.randomPoint(this.stage.window);
    }
  }, {
    key: "start",
    value: function start() {
      if (this.isPlaying) {
        return;
      }
      this.stage.initClip();
      this.isPlaying = true;
      this.update();
    }
  }, {
    key: "pause",
    value: function pause() {
      this.isPlaying = false;
    }
  }, {
    key: "update",
    value: function update() {
      var timeStamp = Date.now();
      this.updateCallback(timeStamp);
      var w = this.stage.window;
      this.stage.clear();
      this.stage.draw(timeStamp);
      if (this.isPlaying) {
        requestAnimationFrame(this.update.bind(this));
      }
    }
  }, {
    key: "autoSize",
    value: function autoSize() {
      var _this2 = this;

      var ds = this.domElement.style;
      var cs = this.canvas.style;
      cs.width = ds.width = "100%";
      cs.height = ds.height = "100%";
      window.addEventListener("resize", function () {
        return _this2.onAutoSize();
      });
    }
  }, {
    key: "onAutoSize",
    value: function onAutoSize() {
      this.resize(this.domElement.clientWidth, this.domElement.clientHeight);
    }
  }, {
    key: "resize",
    value: function resize(w, h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.stage.drawingArea.setCorners(0, this.canvas.width, 0, this.canvas.height);
    }
  }]);

  return CompleteGui;
}();

exports.default = CompleteGui;

},{"../api":5,"./Mouse":15,"./Stage":16,"./Tool":17,"./ToolsSelector":18,"./commands":24}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mouse = require("../utils/Mouse");

var _Mouse2 = _interopRequireDefault(_Mouse);

var _maths = require("../maths");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mouse = function () {
  function Mouse(stage) {
    _classCallCheck(this, Mouse);

    this.stage = stage;
    this.mouseInput = new _Mouse2.default(this.stage.canvas);

    var mi = this.mouseInput;
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

    this.position = new _maths.Vector2();
    this.enable();
  }

  _createClass(Mouse, [{
    key: "enable",
    value: function enable() {
      this.onMove.add(this.updatePosition, this);
    }
  }, {
    key: "disable",
    value: function disable() {
      this.onMove.remove(this.updatePosition, this);
    }
  }, {
    key: "updatePosition",
    value: function updatePosition() {
      this.stage.drawingAreaToWindowCoords(this.position.copy(this.mouseInput));
    }
  }, {
    key: "x",
    get: function get() {
      return this.position.x;
    }
  }, {
    key: "y",
    get: function get() {
      return this.position.y;
    }
  }]);

  return Mouse;
}();

exports.default = Mouse;

},{"../maths":35,"../utils/Mouse":40}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _maths = require("../maths");

var maths = _interopRequireWildcard(_maths);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stage = exports.Stage = function () {
  function Stage(canvas, params) {
    _classCallCheck(this, Stage);

    var props = Object.assign({
      drawingArea: maths.Rectangle.makeArea(0, canvas.width, 0, canvas.height),
      window: maths.Rectangle.makeArea(-1.2, 1.2, 1.2, -1.2)
    }, params);

    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.drawingArea = props.drawingArea;
    this.window = props.window;

    this.scale = new maths.Vector2(1, 1);
    this.translation = new maths.Vector2();
    this.computeTransform();

    this.items = [];
  }

  _createClass(Stage, [{
    key: "clear",
    value: function clear() {
      var a = this.drawingArea;
      this.ctx.clearRect(a.x, a.y, a.width, a.height);
    }
  }, {
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
        items[_key] = arguments[_key];
      }

      items.forEach(function (item) {
        if (_this.items.indexOf(item) !== -1) {
          return;
        }
        _this.items.push(item);
      });
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;

      for (var _len2 = arguments.length, items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        items[_key2] = arguments[_key2];
      }

      items.forEach(function (item) {
        var id = _this2.items.indexOf(item);
        if (id !== -1) {
          _this2.items.splice(id, 1);
        }
      });
    }
  }, {
    key: "computeTransform",
    value: function computeTransform() {
      var da = this.drawingArea;
      var wi = this.window;
      var sx = da.width / wi.width;
      var sy = da.height / wi.height;

      var scale = Math.min(Math.abs(sx), Math.abs(sy));
      this.scale.set(Math.sign(sx) * scale, Math.sign(sy) * scale);
      this.translation.set(da.x - wi.x * this.scale.x, da.y - wi.y * this.scale.y);
    }
  }, {
    key: "initClip",
    value: function initClip() {
      var da = this.drawingArea;
      var c = this.ctx;
      c.beginPath();
      c.moveTo(da.x, da.y);
      c.lineTo(da.x + da.width, da.y);
      c.lineTo(da.x + da.width, da.y + da.height);
      c.lineTo(da.x, da.y + da.height);
      c.lineTo(da.x, da.y);
      c.clip();
    }
  }, {
    key: "_drawItems",
    value: function _drawItems(items, frameId) {
      var _this3 = this;

      var da = this.drawingArea;
      var c = this.ctx;

      items.forEach(function (item) {
        if (Array.isArray(item)) {
          _this3._drawItems(item, frameId);
        } else {
          item.construction.update(frameId);
          item.drawingFunc(_this3, item);
        }
      });
    }
  }, {
    key: "drawingAreaToWindowCoords",
    value: function drawingAreaToWindowCoords(v) {
      return v.sub(this.translation).divide(this.scale);
    }
  }, {
    key: "windowToDrawingAreaCoords",
    value: function windowToDrawingAreaCoords(v) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new maths.Vector2();

      return v.multiply(this.scale).sub(this.translation);
    }
  }, {
    key: "draw",
    value: function draw(frameId) {
      this.computeTransform();

      // this.initClip();
      this._drawItems(this.items, frameId);
    }
  }, {
    key: "resize",
    value: function resize(w, h) {}
  }, {
    key: "width",
    get: function get() {
      return this.area.width;
    }
  }, {
    key: "height",
    get: function get() {
      return this.area.height;
    }
  }]);

  return Stage;
}();

},{"../maths":35}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tool = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require("../utils/Signal");

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tool = exports.Tool = function () {
  function Tool(stage, mouse, commandClass, description, icon) {
    _classCallCheck(this, Tool);

    this.stage = stage;
    this.mouse = mouse;
    this.commandClass = commandClass;
    this.description = description;
    this.icon = icon;
    this.commandCompleted = new _Signal2.default();
  }

  _createClass(Tool, [{
    key: "enable",
    value: function enable() {
      this.startCommand();
    }
  }, {
    key: "disable",
    value: function disable() {
      this.currentCommand.disable();
    }
  }, {
    key: "startCommand",
    value: function startCommand() {
      this.currentCommand = new this.commandClass(this.stage, this.mouse);
      this.currentCommand.completed.add(this.onCommandComplete, this);
      this.currentCommand.enable();
    }
  }, {
    key: "onCommandComplete",
    value: function onCommandComplete() {
      this.currentCommand.completed.remove(this.onCommandComplete, this);
      this.commandCompleted.dispatch(this.currentCommand);
      this.currentCommand.disable();
      this.startCommand();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      this.currentCommand.cancel();
    }
  }]);

  return Tool;
}();

},{"../utils/Signal":41}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ToolsSelector = function () {
  function ToolsSelector(tools) {
    _classCallCheck(this, ToolsSelector);

    this.domElement = document.createElement("ul");
    this.tools = tools;
    this.onClickBind = this.onClick.bind(this);
    this.setCurrentTool(this.tools[0]);
  }

  _createClass(ToolsSelector, [{
    key: "enable",
    value: function enable() {
      this.domElement.addEventListener("click", this.onClickBind);
    }
  }, {
    key: "disable",
    value: function disable() {
      this.domElement.removeEventListener("click", this.onClickBind);
    }
  }, {
    key: "buildList",
    value: function buildList() {
      var _this = this;

      this.tools.forEach(function (tool, i) {
        var element = document.createElement("li");
        element.innerHTML = tool.description;
        element.dataset.id = i;
        _this.domElement.appendChild(element);
      });
    }
  }, {
    key: "onClick",
    value: function onClick(evt) {
      var id = parseInt(evt.target.dataset.id);
      this.setCurrentTool(this.tools[id]);
    }
  }, {
    key: "setCurrentTool",
    value: function setCurrentTool(tool) {
      if (this.currentTool !== undefined) {
        this.currentTool.disable();
      }
      this.currentTool = tool;
      this.currentTool.enable();
    }
  }]);

  return ToolsSelector;
}();

exports.default = ToolsSelector;

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CircleCenterPoint = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require("../../utils/Signal");

var _Signal2 = _interopRequireDefault(_Signal);

var _SelectOrCreatePoint = require("./SelectOrCreatePoint");

var _api = require("../../api");

var api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CircleCenterPoint = exports.CircleCenterPoint = function () {
  function CircleCenterPoint(stage, mouse) {
    _classCallCheck(this, CircleCenterPoint);

    this.completed = new _Signal2.default();
    this.stage = stage;
    this.mouse = mouse;
  }

  _createClass(CircleCenterPoint, [{
    key: "enable",
    value: function enable() {
      this.centerCommand = new _SelectOrCreatePoint.SelectOrCreatePoint(this.stage, this.mouse);
      this.centerCommand.enable();
      this.centerCommand.completed.add(this.onCenter, this);
      this.pointCommand = this.centerCommand;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.centerCommand.completed.remove(this.onCenter, this);
      if (this.pointCommand) {
        this.pointCommand.completed.remove(this.onPoint, this);
      }
      this.pointCommand.disable();
    }
  }, {
    key: "onCenter",
    value: function onCenter(center) {
      this.center = center;
      this.pointTemp = api.mouse(this.stage, this.mouse);
      this.circle = api.circle(this.center, this.pointTemp);
      this.circle.selectable = false;
      this.center.selectable = false;
      this.pointTemp.selectable = false;
      this.stage.add(this.circle);
      this.stage.add(this.pointTemp);

      this.centerCommand.completed.remove(this.onCenter, this);
      this.centerCommand.disable();

      this.pointCommand = new _SelectOrCreatePoint.SelectOrCreatePoint(this.stage, this.mouse);
      this.pointCommand.enable();
      this.pointCommand.completed.add(this.onPoint, this);
      this.pointCommand = this.pointCommand;
    }
  }, {
    key: "onPoint",
    value: function onPoint(point) {
      this.point = point;

      this.pointCommand.completed.remove(this.onCenter, this);
      this.pointCommand.disable();

      this.circle.construction.src.point = this.point;
      this.circle.selectable = true;
      this.center.selectable = true;
      this.point.selectable = true;
      this.stage.remove(this.pointTemp);

      this.completed.dispatch(this.circle);
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.center) {
        this.centerCommand.undo();
        this.stage.remove(this.circle);
        this.pointCommand.completed.remove(this.onCenter, this);
        this.pointCommand.disable();
      }
    }
  }, {
    key: "undo",
    value: function undo() {
      this.centerCommand.undo();
      this.pointCommand.undo();
      this.stage.remove(this.circle);
    }
  }, {
    key: "redo",
    value: function redo() {
      this.centerCommand.redo();
      this.pointCommand.redo();
      this.stage.add(this.line);
    }
  }]);

  return CircleCenterPoint;
}();

},{"../../api":5,"../../utils/Signal":41,"./SelectOrCreatePoint":23}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragPoint = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require("../../api");

var api = _interopRequireWildcard(_api);

var _maths = require("../../maths");

var maths = _interopRequireWildcard(_maths);

var _Signal = require("../../utils/Signal");

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragPoint = exports.DragPoint = function () {
  function DragPoint(stage, mouse) {
    _classCallCheck(this, DragPoint);

    this.stage = stage;
    this.mouse = mouse;
    this.selectionCircle = new maths.Circle(undefined, 5);
    this.completed = new _Signal2.default();

    this.originalPos = new maths.Vector2();
    this.resultPos = new maths.Vector2();
    this.target = undefined;
  }

  _createClass(DragPoint, [{
    key: "enable",
    value: function enable() {
      this.mouse.onDown.add(this.onDown, this);
    }
  }, {
    key: "disable",
    value: function disable() {
      this.mouse.onDown.remove(this.onDown, this);
      this.mouse.onUp.remove(this.onUp, this);
      this.mouse.onMove.remove(this.onMove, this);
    }
  }, {
    key: "onDown",
    value: function onDown() {
      this.selectionCircle.center.copy(this.mouse);
      this.selectionCircle.radius = 10 / Math.abs(this.stage.scale.x);

      var points = api.selectInCircle(this.stage.items, this.selectionCircle).filter(function (item) {
        var isPoint = item.object.type === api.types.point;
        var isDraggable = item.construction !== api.defaultConstruction;
        return isPoint && isDraggable;
      });
      points.sort(function (a, b) {
        return Math.abs(b.distance) - Math.abs(a.distance);
      });
      if (points.length > 0) {
        this.startDrag(points[0].object);
      }
    }
  }, {
    key: "startDrag",
    value: function startDrag(target) {
      this.target = target;

      this.originalPos.copy(this.target.geom);
      this.mouse.onMove.add(this.onMove, this);
      this.mouse.onUp.add(this.onUp, this);
    }
  }, {
    key: "onUp",
    value: function onUp() {
      this.resultPos.copy(this.target.geom);
      this.mouse.onMove.remove(this.onMove, this);
      this.mouse.onUp.remove(this.onUp, this);
      this.completed.dispatch();
    }
  }, {
    key: "onMove",
    value: function onMove() {
      this.target.geom.copy(this.mouse);
    }
  }, {
    key: "cancel",
    value: function cancel() {}
  }, {
    key: "undo",
    value: function undo() {
      this.target.geom.copy(this.originalPos);
    }
  }, {
    key: "redo",
    value: function redo() {
      this.target.geom.copy(this.resultPos);
    }
  }]);

  return DragPoint;
}();

},{"../../api":5,"../../maths":35,"../../utils/Signal":41}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragStage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Loop = require("../../utils/Loop");

var _Loop2 = _interopRequireDefault(_Loop);

var _Signal = require("../../utils/Signal");

var _Signal2 = _interopRequireDefault(_Signal);

var _api = require("../../api");

var api = _interopRequireWildcard(_api);

var _maths = require("../../maths");

var maths = _interopRequireWildcard(_maths);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragStage = exports.DragStage = function () {
  function DragStage(stage, mouse) {
    _classCallCheck(this, DragStage);

    this.completed = new _Signal2.default();

    this.stage = stage;
    this.window = this.stage.window;
    this.mouse = mouse;

    this.mouseLastPos = new maths.Vector2();
    this.mouseBeginPos = new maths.Vector2();
    this.windowBeginPos = new maths.Vector2();

    this.friction = 0.9;
    this.vel = new maths.Vector2();

    this.moveLoop = new _Loop2.default(this.onMoveRelease, this, false);
  }

  _createClass(DragStage, [{
    key: "startDrag",
    value: function startDrag() {
      this.moveLoop.pause();
      this.mouse.onMove.add(this.onDrag, this);

      this.mouseLastPos.copy(this.mouse.mouseInput);
      this.mouseBeginPos.copy(this.mouse.mouseInput);
      this.windowBeginPos.copy(this.window);

      this.mouse.mouseInput.setCursor("grabbing");
    }
  }, {
    key: "stopDrag",
    value: function stopDrag() {
      this.mouse.onMove.remove(this.onDrag, this);
      this.mouse.mouseInput.setCursor("grab");
      this.moveLoop.play();
    }
  }, {
    key: "onDrag",
    value: function onDrag() {
      var tmp = maths.Vector2.create();
      var mouseDiff = tmp.copy(this.mouse.mouseInput).sub(this.mouseBeginPos).divide(this.stage.scale).multiplyScalar(-1);
      var t = mouseDiff.add(this.windowBeginPos);
      this.window.x = t.x;
      this.window.y = t.y;
      this.vel.copy(this.mouse.mouseInput).sub(this.mouseLastPos);
      this.mouseLastPos.copy(this.mouse.mouseInput);
      tmp.dispose();
    }
  }, {
    key: "onMoveRelease",
    value: function onMoveRelease() {
      this.vel.multiplyScalar(this.friction);

      var v = this.vel.clone().divide(this.stage.scale).multiplyScalar(-1);

      this.window.x += v.x;
      this.window.y += v.y;

      if (this.vel.getLength() < 0.01) {
        this.moveLoop.pause();
      }
      v.dispose();
    }
  }, {
    key: "enable",
    value: function enable() {
      this.mouse.onDown.add(this.startDrag, this);
      this.mouse.onUp.add(this.stopDrag, this);
      this.mouse.mouseInput.setCursor("grab");
    }
  }, {
    key: "disable",
    value: function disable() {
      this.mouse.onDown.remove(this.startDrag, this);
      this.mouse.onUp.remove(this.stopDrag, this);
      this.mouse.onMove.remove(this.onDrag, this);
      this.mouse.mouseInput.setCursor("default");
      this.moveLoop.pause();
    }
  }]);

  return DragStage;
}();

},{"../../api":5,"../../maths":35,"../../utils/Loop":39,"../../utils/Signal":41}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinePointPoint = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require("../../utils/Signal");

var _Signal2 = _interopRequireDefault(_Signal);

var _SelectOrCreatePoint = require("./SelectOrCreatePoint");

var _api = require("../../api");

var api = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinePointPoint = exports.LinePointPoint = function () {
  function LinePointPoint(stage, mouse) {
    _classCallCheck(this, LinePointPoint);

    this.completed = new _Signal2.default();
    this.stage = stage;
    this.mouse = mouse;
  }

  _createClass(LinePointPoint, [{
    key: "enable",
    value: function enable() {
      this.p1Command = new _SelectOrCreatePoint.SelectOrCreatePoint(this.stage, this.mouse);
      this.p1Command.enable();
      this.p1Command.completed.add(this.onP1, this);
      this.pointCommand = this.p1Command;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.p1Command.completed.remove(this.onP1, this);
      if (this.p2Command) {
        this.p2Command.completed.remove(this.onP2, this);
      }
      this.pointCommand.disable();
    }
  }, {
    key: "onP1",
    value: function onP1(p1) {
      this.p1 = p1;
      this.p2Temp = api.mouse(this.stage, this.mouse);
      this.line = api.line(this.p1, this.p2Temp);
      this.line.selectable = false;
      this.p1.selectable = false;
      this.p2Temp.selectable = false;
      this.stage.add(this.line);
      this.stage.add(this.p2Temp);

      this.p1Command.completed.remove(this.onP1, this);
      this.p1Command.disable();

      this.p2Command = new _SelectOrCreatePoint.SelectOrCreatePoint(this.stage, this.mouse);
      this.p2Command.enable();
      this.p2Command.completed.add(this.onP2, this);
      this.pointCommand = this.p2Command;
    }
  }, {
    key: "onP2",
    value: function onP2(p2) {
      this.p2 = p2;

      this.p2Command.completed.remove(this.onP1, this);
      this.p2Command.disable();

      this.line.construction.src.p2 = this.p2;
      this.line.selectable = true;
      this.p1.selectable = true;
      this.p2.selectable = true;
      this.stage.remove(this.p2Temp);

      this.completed.dispatch(this.line);
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.p1) {
        this.p1Command.undo();
        this.stage.remove(this.line);
        this.p2Command.completed.remove(this.onP1, this);
        this.p2Command.disable();
      }
    }
  }, {
    key: "undo",
    value: function undo() {
      this.p1Command.undo();
      this.p2Command.undo();
      this.stage.remove(this.line);
    }
  }, {
    key: "redo",
    value: function redo() {
      this.p1Command.redo();
      this.p2Command.redo();
      this.stage.add(this.line);
    }
  }]);

  return LinePointPoint;
}();

},{"../../api":5,"../../utils/Signal":41,"./SelectOrCreatePoint":23}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectOrCreatePoint = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _api = require("../../api");

var api = _interopRequireWildcard(_api);

var _maths = require("../../maths");

var maths = _interopRequireWildcard(_maths);

var _Signal = require("../../utils/Signal");

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SelectOrCreatePoint = exports.SelectOrCreatePoint = function () {
  function SelectOrCreatePoint(stage, mouse) {
    _classCallCheck(this, SelectOrCreatePoint);

    this.stage = stage;
    this.mouse = mouse;
    this.selectionCircle = new maths.Circle(undefined, 5);
    this.completed = new _Signal2.default();
  }

  _createClass(SelectOrCreatePoint, [{
    key: "enable",
    value: function enable() {
      this.mouse.onUp.add(this.onClick, this);
    }
  }, {
    key: "disable",
    value: function disable() {
      this.mouse.onUp.remove(this.onClick, this);
    }
  }, {
    key: "onClick",
    value: function onClick() {
      this.selectionCircle.center.copy(this.mouse);
      this.selectionCircle.radius = 10 / Math.abs(this.stage.scale.x);

      var selection = api.selectInCircle(this.stage.items, this.selectionCircle);
      if (selection.length === 0) {
        this.point = api.point(this.selectionCircle.center.x, this.selectionCircle.center.y);
        this.pointCreated = true;
      } else {
        var points = selection.filter(function (item) {
          return item.object.type === api.types.point;
        });
        if (points.length > 0) {
          selection = points;
        }

        selection.sort(function (a, b) {
          return Math.abs(b.distance) - Math.abs(a.distance);
        });
        var closestObject = selection[0].object;
        this.point = api.pointOnObject(closestObject, this.selectionCircle.center);
        this.pointCreated = closestObject.type !== api.types.point;
      }

      if (this.pointCreated) {
        this.stage.add(this.point);
      }
      this.completed.dispatch(this.point, this.pointCreated);
    }
  }, {
    key: "cancel",
    value: function cancel() {}
  }, {
    key: "undo",
    value: function undo() {
      if (this.pointCreated) {
        this.stage.remove(this.point);
      }
    }
  }, {
    key: "redo",
    value: function redo() {
      if (this.pointCreated) {
        this.stage.add(this.point);
      }
    }
  }]);

  return SelectOrCreatePoint;
}();

},{"../../api":5,"../../maths":35,"../../utils/Signal":41}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CircleCenterPoint = require("./CircleCenterPoint");

Object.keys(_CircleCenterPoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _CircleCenterPoint[key];
    }
  });
});

var _LinePointPoint = require("./LinePointPoint");

Object.keys(_LinePointPoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LinePointPoint[key];
    }
  });
});

var _DragPoint = require("./DragPoint");

Object.keys(_DragPoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _DragPoint[key];
    }
  });
});

var _DragStage = require("./DragStage");

Object.keys(_DragStage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _DragStage[key];
    }
  });
});

var _SelectOrCreatePoint = require("./SelectOrCreatePoint");

Object.keys(_SelectOrCreatePoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SelectOrCreatePoint[key];
    }
  });
});

},{"./CircleCenterPoint":19,"./DragPoint":20,"./DragStage":21,"./LinePointPoint":22,"./SelectOrCreatePoint":23}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = function () {
  function Color() {
    var h = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, Color);

    this.set(h, s, l, a);
  }

  _createClass(Color, [{
    key: "set",
    value: function set() {
      var h = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      this.h = h;
      this.s = s;
      this.l = l;
      this.a = a;
    }
  }, {
    key: "copy",
    value: function copy(color) {
      this.h = color.h;
      this.s = color.s;
      this.l = color.l;
      this.a = color.a;
    }
  }, {
    key: "toString",
    value: function toString() {
      var h = Math.round(this.h);
      var s = Math.round(100 * this.s);
      var l = Math.round(100 * this.l);
      return "hsla(" + h + ", " + s + "%, " + l + "%, " + this.a + ")";
    }
  }]);

  return Color;
}();

exports.default = Color;

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Color = require("./Color");

var _Color2 = _interopRequireDefault(_Color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Style = function () {
  function Style(values) {
    _classCallCheck(this, Style);

    this.set(values);
  }

  _createClass(Style, [{
    key: "set",
    value: function set(values) {
      if (values === undefined) {
        values = {};
      }
      this.fill = values.fill;
      this.stroke = values.stroke;
      this.dash = values.dash;
      this.lineWidth = values.lineWidth;
    }
  }]);

  return Style;
}();

exports.default = Style;

},{"./Color":25}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawPoint = drawPoint;
exports.drawCircle = drawCircle;
exports.drawSegment = drawSegment;
exports.drawLine = drawLine;
exports.drawVector = drawVector;
exports.drawPolygon = drawPolygon;
function drawPoint(stage, point) {
  var radius = 5;
  var x = point.geom.x;
  var y = point.geom.y;

  var ctx = stage.ctx;
  ctx.beginPath();
  ctx.save();
  var s = stage.scale;
  var t = stage.translation;
  ctx.moveTo(t.x + x * s.x + radius, t.y + y * s.y);
  ctx.arc(t.x + x * s.x, t.y + y * s.y, radius, 0, 2 * Math.PI);
  ctx.restore();
  var style = point.style;
  ctx.save();
  if (style.stroke !== undefined) {
    ctx.strokeStyle = style.stroke.toString();
    if (style.dash !== undefined) {
      ctx.setLineDash(style.dash);
    }
    ctx.stroke();
  }
  if (style.fill !== undefined) {
    ctx.fillStyle = style.fill.toString();
    ctx.fill();
  }
  ctx.restore();
}

function drawCircle(stage, circle) {
  var radius = 5;
  var c = circle.geom.center;
  var r = circle.geom.radius;

  var ctx = stage.ctx;
  ctx.beginPath();
  ctx.save();
  ctx.translate(stage.translation.x, stage.translation.y);
  ctx.scale(stage.scale.x, stage.scale.y);
  ctx.moveTo(c.x + r, c.y);
  ctx.arc(c.x, c.y, r, 0, 2 * Math.PI);
  ctx.restore();
  ctx.save();

  var style = circle.style;
  if (style.stroke !== undefined) {
    ctx.strokeStyle = style.stroke.toString();
    if (style.dash !== undefined) {
      ctx.setLineDash(style.dash);
    }
    ctx.stroke();
  }
  if (style.fill !== undefined) {
    ctx.fillStyle = style.fill.toString();
    ctx.fill();
  }
  ctx.restore();
}

function drawSegment(stage, segment) {
  var ctx = stage.ctx;
  var p1 = segment.geom.p1;
  var p2 = segment.geom.p2;
  ctx.beginPath();
  ctx.save();
  ctx.translate(stage.translation.x, stage.translation.y);
  ctx.scale(stage.scale.x, stage.scale.y);
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.restore();

  var style = segment.style;
  ctx.save();
  if (style.stroke !== undefined) {
    ctx.strokeStyle = style.stroke.toString();
    ctx.stroke();
    if (style.dash !== undefined) {
      ctx.setLineDash(style.dash);
    }
  }
  ctx.restore();
}

function drawLine(stage, line) {
  var l = line.geom;
  var ctx = stage.ctx;
  ctx.beginPath();
  var w = stage.window;
  ctx.save();
  ctx.translate(stage.translation.x, stage.translation.y);
  ctx.scale(stage.scale.x, stage.scale.y);
  if (l.vector.x === 0) {
    ctx.moveTo(l.point.x, w.y);
    ctx.lineTo(l.point.x, w.y + w.height);
  } else {
    console.log(w.x, w.width);

    ctx.moveTo(w.x, l.getYFromX(w.x));
    ctx.lineTo(w.x + w.width, l.getYFromX(w.x + w.width));
  }
  ctx.restore();

  var style = line.style;
  ctx.save();
  if (style.stroke !== undefined) {
    ctx.strokeStyle = style.stroke.toString();
    if (style.dash !== undefined) {
      ctx.setLineDash(style.dash);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawVector(stage, vector) {
  var ctx = stage.ctx;
  var p1 = vector.geom.p1;
  var p2 = vector.geom.p2;
  ctx.beginPath();
  ctx.save();
  ctx.translate(stage.translation.x, stage.translation.y);
  ctx.scale(stage.scale.x, stage.scale.y);
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  var style = vector.style;
  ctx.save();
  if (style.stroke !== undefined) {
    ctx.strokeStyle = style.stroke.toString();
    if (style.dash !== undefined) {
      ctx.setLineDash(style.dash);
    }
    ctx.stroke();
  }
  ctx.restore();

  var arrowLength = 5 / stage.scale.x;
  var arrowWidth = 5 / stage.scale.x;
  var end = p2;
  var diff = p2.clone().sub(p1);

  var length = diff.clone().setLength(arrowLength);
  var width = diff.clone().setLength(arrowWidth);
  var end2 = end.clone().sub(length);

  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end2.x + width.y, end2.y - width.x);
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end2.x - width.y, end2.y + width.x);

  ctx.restore();

  ctx.save();
  if (style.stroke !== undefined) {
    ctx.strokeStyle = style.stroke.toString();
    ctx.stroke();
  }
  ctx.restore();
}

function drawPolygon(stage, polygon) {
  var ctx = stage.ctx;
  ctx.beginPath();
  ctx.save();
  ctx.translate(stage.translation.x, stage.translation.y);
  ctx.scale(stage.scale.x, stage.scale.y);
  var pts = polygon.geom;
  var n = pts.length;
  var p = pts[n - 1];
  ctx.moveTo(p.x, p.y);
  for (var i = 0; i < n; i++) {
    p = pts[i];
    ctx.lineTo(p.x, p.y);
  }
  ctx.restore();

  var style = polygon.style;
  ctx.save();
  if (style.stroke !== undefined) {
    ctx.strokeStyle = style.stroke.toString();
    if (style.dash !== undefined) {
      ctx.setLineDash(style.dash);
    }
    ctx.stroke();
  }
  if (style.fill !== undefined) {
    ctx.fillStyle = style.fill.toString();
    ctx.fill();
  }
  ctx.restore();
}

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Circle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("./index");

var maths = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Circle = exports.Circle = function () {
  function Circle(center, radius) {
    _classCallCheck(this, Circle);

    this.set(center, radius);
  }

  _createClass(Circle, [{
    key: "set",
    value: function set() {
      var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new maths.Vector2();
      var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      this.center = center;
      this.radius = radius;
    }
  }, {
    key: "copy",
    value: function copy(circle) {
      this.center.copy(circle.center);
      this.radius = circle.radius;
    }
  }]);

  return Circle;
}();

},{"./index":35}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Line = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("./index");

var maths = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = exports.Line = function () {
  function Line() {
    var point = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new maths.Vector2();
    var vector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new maths.Vector2();

    _classCallCheck(this, Line);

    this.point = point;
    this.vector = vector;
  }

  _createClass(Line, [{
    key: "getYFromX",
    value: function getYFromX(x) {
      var t = (x - this.point.x) / this.vector.x;
      return this.point.y + t * this.vector.y;
    }
  }, {
    key: "getXFromY",
    value: function getXFromY(y) {
      var t = (y - this.point.y) / this.vector.y;
      return this.point.x + t * this.vector.x;
    }
  }, {
    key: "getPointAt",
    value: function getPointAt(t) {
      var v = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new maths.Vector2();

      return v.copy(this.vector).multiplyScalar(t).add(this.point);
    }
  }]);

  return Line;
}();

},{"./index":35}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//www.j3d.org/matrix_faq/matrfaq_latest.html
var Matrix3 = function () {
  function Matrix3() {
    var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var e = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var f = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var g = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var h = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
    var i = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;

    _classCallCheck(this, Matrix3);

    this.data = new Float32Array(9);
    this.set(a, b, c, d, e, f, g, h, i);
  }

  _createClass(Matrix3, [{
    key: "identity",
    value: function identity() {
      return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
  }, {
    key: "set",
    value: function set() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var e = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var f = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var g = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var h = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      var i = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;

      var t = this.data;
      t[0] = a;t[1] = b;t[2] = c;
      t[3] = d;t[4] = e;t[5] = f;
      t[6] = g;t[7] = h;t[8] = i;
      return this;
    }
  }, {
    key: "copy",
    value: function copy(mat) {
      var t0 = this.data;
      var t1 = mat.data;
      t0[0] = t1[0];t0[3] = t1[3];t0[6] = t1[6];
      t0[1] = t1[1];t0[4] = t1[4];t0[7] = t1[7];
      t0[2] = t1[2];t0[5] = t1[5];t0[8] = t1[8];
      return this;
    }
  }, {
    key: "transformVector2",
    value: function transformVector2(v) {
      var t = this.data;
      var x = v.x,
          y = v.y;
      v.x = t[0] * x + t[1] * y + t[2];
      v.y = t[3] * x + t[4] * y + t[5];
      v.z = t[6] * x + t[7] * y + t[8];
      return this;
    }

    //m x this

  }, {
    key: "multiplyMat",
    value: function multiplyMat(m) {
      var t = m.data;
      this.multiply(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
      return this;
    }

    //m x this

  }, {
    key: "multiply",
    value: function multiply(a, b, c, d, e, f, g, h, i) {
      var t = this.data;
      return this.set(a * t[0] + b * t[3] + c * t[6], d * t[6] + e * t[3] + f * t[6], g * t[6] + h * t[3] + i * t[6], a * t[1] + b * t[4] + c * t[7], d * t[1] + e * t[4] + f * t[7], g * t[1] + h * t[4] + i * t[7], a * t[2] + b * t[5] + c * t[8], d * t[2] + e * t[5] + f * t[8], g * t[2] + h * t[5] + i * t[8]);
    }
  }, {
    key: "invert",
    value: function invert() {
      var det = this.determinant;
      if (Math.abs(det) < 0.0005) {
        return this.identity();
      }
      var t = this.data;

      var iDet = 1 / det;
      return this.set((t[4] * t[8] - t[7] * t[5]) * iDet, -(t[3] * t[8] - t[6] * t[5]) * iDet, (t[3] * t[7] - t[6] * t[4]) * iDet, -(t[1] * t[8] - t[7] * t[2]) * iDet, (t[0] * t[8] - t[6] * t[2]) * iDet, -(t[0] * t[7] - t[6] * t[1]) * iDet, (t[1] * t[5] - t[4] * t[2]) * iDet, -(t[0] * t[5] - t[3] * t[2]) * iDet, (t[0] * t[4] - t[3] * t[1]) * iDet);
    }
  }, {
    key: "transpose",
    value: function transpose() {
      var t = this.data;
      return this.set(t[0], t[3], t[6], t[1], t[4], t[7], t[2], t[5], t[8]);
    }
  }, {
    key: "clone",
    value: function clone() {
      var cloneMat = new Matrix3();
      var t0 = this.data;
      var t1 = cloneMat.data;
      for (var i = 0; i < 9; i++) {
        t1[i] = t0[i];
      }
      return cloneMat;
    }
  }, {
    key: "toString",
    value: function toString() {
      var t = this.data;
      return "[Mat3\n      " + t[0] + ", " + t[1] + ", " + t[2] + "\n      " + t[3] + ", " + t[4] + ", " + t[5] + "\n      " + t[6] + ", " + t[7] + ", " + t[8] + "\n    ]";
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return this.data;
    }
  }, {
    key: "determinant",
    get: function get() {
      var t = this.data;
      return t[0] * (t[4] * t[8] - t[7] * t[5]) - t[1] * (t[3] * t[8] - t[6] * t[5]) + t[2] * (t[3] * t[7] - t[6] * t[4]);
    }
  }]);

  return Matrix3;
}();

exports.default = Matrix3;

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rectangle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = require("./Vector2");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rectangle = exports.Rectangle = function () {
  _createClass(Rectangle, null, [{
    key: "makeArea",
    value: function makeArea(xMin, xMax, yMin, yMax) {
      return new Rectangle().setCorners(xMin, xMax, yMin, yMax);
    }
  }]);

  function Rectangle(x, y, width, height) {
    _classCallCheck(this, Rectangle);

    this.set(x, y, width, height);
  }

  _createClass(Rectangle, [{
    key: "set",
    value: function set(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      return this;
    }
  }, {
    key: "setCorners",
    value: function setCorners(xMin, xMax, yMin, yMax) {
      this.x = xMin;
      this.y = yMin;
      this.width = xMax - xMin;
      this.height = yMax - yMin;
      return this;
    }
  }, {
    key: "copy",
    value: function copy(rect) {
      this.x = rect.x;
      this.y = rect.y;
      this.width = rect.width;
      this.height = rect.height;
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Rectangle().copy(this);
    }
  }]);

  return Rectangle;
}();

},{"./Vector2":33}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Segment = undefined;

var _index = require("./index");

var maths = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Segment = exports.Segment = function Segment() {
  var p1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new maths.Vector2();
  var p2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new maths.Vector2();

  _classCallCheck(this, Segment);

  this.p1 = p1;
  this.p2 = p2;
};

},{"./index":35}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector2 = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("./index");

var maths = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pool = [];

var Vector2 = exports.Vector2 = function () {
  _createClass(Vector2, null, [{
    key: "create",
    value: function create() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (pool.length > 0) {
        return pool.pop().set(x, y);
      } else return new Vector2(x, y);
    }
  }, {
    key: "dist",
    value: function dist(v1, v2) {
      var dx = v2.x - v1.x;
      var dy = v2.y - v1.y;
      return Math.hypot(dx, dy);
    }
  }, {
    key: "angle",
    value: function angle(v1, v2) {
      var ang1 = Math.atan2(v1.y, v1.x);
      var ang2 = Math.atan2(v2.y, v2.x);
      return ang1 + ang2;
    }
  }, {
    key: "lerp",
    value: function lerp(v1, v2, t) {
      return v1.clone().lerp(v2, t);
    }
  }]);

  function Vector2(x, y) {
    _classCallCheck(this, Vector2);

    this.set(x, y);
  }

  _createClass(Vector2, [{
    key: "add",
    value: function add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
  }, {
    key: "sub",
    value: function sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }
  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(s) {
      this.x *= s;
      this.y *= s;
      return this;
    }
  }, {
    key: "scale",
    value: function scale(sx, sy) {
      this.x *= sx;
      this.y *= sy;
      return this;
    }
  }, {
    key: "multiply",
    value: function multiply(v) {
      this.x *= v.x;
      this.y *= v.y;
      return this;
    }
  }, {
    key: "divide",
    value: function divide(v) {
      this.x /= v.x;
      this.y /= v.y;
      return this;
    }
  }, {
    key: "lerp",
    value: function lerp(v1, v2, t) {
      this.copy(v2).sub(v1).multiplyScalar(t).add(v1);
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return Vector2.create(this.x, this.y);
    }
  }, {
    key: "copy",
    value: function copy(v) {
      this.x = v.x;
      this.y = v.y;
      return this;
    }
  }, {
    key: "set",
    value: function set() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      this.x = x;
      this.y = y;
      return this;
    }
  }, {
    key: "normalize",
    value: function normalize() {
      return this.setLength(1);
    }
  }, {
    key: "setLength",
    value: function setLength(l) {
      var r = l / this.getLength();
      this.x *= r;
      this.y *= r;
      return this;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return Math.hypot(this.x, this.y);
    }
  }, {
    key: "dot",
    value: function dot(v) {
      return this.x * v.x + this.y * v.y;
    }
  }, {
    key: "cross",
    value: function cross(v) {
      return this.x * v.y - this.y * v.x;
    }
  }, {
    key: "rotate",
    value: function rotate(a) {
      var ca = Math.cos(a);
      var sa = Math.sin(a);
      var x = this.x;
      var y = this.y;
      this.x = ca * x - sa * y;
      this.y = ca * y + sa * x;
      return this;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      pool.push(this);
    }
  }]);

  return Vector2;
}();

},{"./index":35}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vectorsDistance = vectorsDistance;
exports.vectorLineDistance = vectorLineDistance;
exports.vectorCircleDistance = vectorCircleDistance;
exports.circlesDistance = circlesDistance;
exports.lineCircleDistance = lineCircleDistance;

var _index = require("./index");

var maths = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function vectorsDistance(v1, v2) {
  var dx = v2.x - v1.x;
  var dy = v2.y - v1.y;
  return Math.hypot(dx, dy);
}

function vectorLineDistance(vector, line) {
  var l2 = new maths.Line(vector, new maths.Vector2(-line.vector.y, line.vector.x));
  var p = maths.linesIntersection(line, l2);
  return vectorsDistance(vector, p);
}

function vectorCircleDistance(v, c) {
  return vectorsDistance(v, c.center) - c.radius;
}

function circlesDistance(c1, c2) {
  return vectorsDistance(c1.center, c2.center) - (c1.radius + c2.radius);
}

function lineCircleDistance(l, c) {
  return vectorLineDistance(c.center, l) - c.radius;
}

},{"./index":35}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Vector = require("./Vector2");

Object.keys(_Vector).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Vector[key];
    }
  });
});

var _Matrix = require("./Matrix3");

Object.keys(_Matrix).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Matrix[key];
    }
  });
});

var _Line = require("./Line");

Object.keys(_Line).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Line[key];
    }
  });
});

var _Segment = require("./Segment");

Object.keys(_Segment).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Segment[key];
    }
  });
});

var _Circle = require("./Circle");

Object.keys(_Circle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Circle[key];
    }
  });
});

var _Rectangle = require("./Rectangle");

Object.keys(_Rectangle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Rectangle[key];
    }
  });
});

var _intersection = require("./intersection");

Object.keys(_intersection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _intersection[key];
    }
  });
});

var _projection = require("./projection");

Object.keys(_projection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _projection[key];
    }
  });
});

var _distance = require("./distance");

Object.keys(_distance).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _distance[key];
    }
  });
});

var _symmetry = require("./symmetry");

Object.keys(_symmetry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _symmetry[key];
    }
  });
});
exports.quadraticRoots = quadraticRoots;
exports.lerp = lerp;
function quadraticRoots(a, b, c) {
  var ds = Math.sqrt(b * b - 4 * a * c);
  return {
    x1: (-b - ds) / (2 * a),
    x2: (-b + ds) / (2 * a)
  };
}

function lerp(a, b, t) {
  return a + t * (b - a);
}

},{"./Circle":28,"./Line":29,"./Matrix3":30,"./Rectangle":31,"./Segment":32,"./Vector2":33,"./distance":34,"./intersection":36,"./projection":37,"./symmetry":38}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linesIntersection = linesIntersection;
exports.lineCircleIntersection = lineCircleIntersection;
exports.circlesIntersections = circlesIntersections;

var _index = require("./index");

var maths = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function linesIntersection(l1, l2) {
  var v = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new maths.Vector2();

  var xv1 = l1.vector.x;
  var yv1 = l1.vector.y;
  var xv2 = l2.vector.x;
  var yv2 = l2.vector.y;
  var dxp = l2.point.x - l1.point.x;
  var dyp = l2.point.y - l1.point.y;

  var t = (yv2 * dxp - xv2 * dyp) / (xv1 * yv2 - xv2 * yv1);

  return l1.getPointAt(t, v);
}

function lineCircleIntersection(line, circle) {
  var v1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new maths.Vector2();
  var v2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new maths.Vector2();

  var v = line.vector;
  var p = line.point;
  var c = circle.center;
  var r = circle.radius;

  var roots = maths.quadraticRoots(v.dot(v), 2 * (p.x * v.x + p.y * v.y - c.x * v.x - c.y * v.y), c.dot(c) + p.dot(p) - 2 * (c.x * p.x + c.y * p.y) - r * r);
  line.getPointAt(roots.x1, v1);
  line.getPointAt(roots.x2, v2);
}

function circlesIntersections(circle1, circle2) {
  var v1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new maths.Vector2();
  var v2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new maths.Vector2();

  var c1 = circle1.center;
  var c2 = circle2.center;
  var r1 = circle1.radius;
  var r2 = circle2.radius;

  var dx = c2.x - c1.x;
  var dy = c2.y - c1.y;
  var ddx = c2.x * c2.x - c1.x * c1.x;
  var ddy = c2.y * c2.y - c1.y * c1.y;
  var ddr = r1 * r1 - r2 * r2;

  var s1 = dx / dy;
  var s2 = (ddr + ddx + ddy) / dy;
  var s3 = c1.y - s2 / 2;

  var roots = void 0,
      f = void 0;
  if (dy === 0) {
    var x = (ddx + ddr) / (2 * dx);
    var dx2 = c1.x - x;
    roots = maths.quadraticRoots(1, -2 * c1.y, c1.y * c1.y + dx2 * dx2 - r1 * r1);
    f = function f(v, y) {
      return v.set(x, y);
    };
  } else {
    roots = maths.quadraticRoots(1 + s1 * s1, 2 * (s1 * s3 - c1.x), s3 * s3 + c1.x * c1.x - r1 * r1);
    f = function f(v, x) {
      return v.set(x, s2 / 2 - s1 * x);
    };
  }
  if (c2.y > c1.y) {
    var t = roots.x1;
    roots.x1 = roots.x2;
    roots.x2 = t;
  }
  f(v1, roots.x1);
  f(v2, roots.x2);
  return { v1: v1, v2: v2 };
}

},{"./index":35}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.projectVectorOnCircle = projectVectorOnCircle;
exports.projectVectorOnLine = projectVectorOnLine;

var _index = require("./index");

var maths = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function projectVectorOnCircle(vector, circle) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new maths.Vector2();

  result.copy(vector).sub(circle.center).setLength(circle.radius).add(circle.center);
  return result;
}

function projectVectorOnLine(vector, line) {
  var ab = line.vector.getLength();
  var ac = maths.vectorsDistance(line.point, vector);
  var bc = maths.vectorsDistance(line.point.clone().add(line.vector), vector);

  var ai = -(bc * bc - ab * ab - ac * ac) / (2 * ab);
  var result = line.vector.clone().setLength(ai).add(line.point);
  vector.copy(result);
  result.dispose();
  return vector;
}

},{"./index":35}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointAxialSymmetry = pointAxialSymmetry;
exports.pointCentralSymmetry = pointCentralSymmetry;
exports.circleAxialSymmetry = circleAxialSymmetry;
exports.circleCentralSymmetry = circleCentralSymmetry;

var _index = require("./index");

var maths = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function pointAxialSymmetry(point, axis) {
  var tmp = point.clone();
  pointCentralSymmetry(point, maths.projectVectorOnLine(tmp, axis));
  tmp.dispose();
  return point;
}

function pointCentralSymmetry(point, center) {
  point.x = 2 * center.x - point.x;
  point.y = 2 * center.y - point.y;
  return point;
}

function circleAxialSymmetry(circle, axis) {
  pointAxialSymmetry(circle.center, axis);
}

function circleCentralSymmetry(circle, center) {
  pointCentralSymmetry(circle.center, center);
}

},{"./index":35}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require("./Signal");

var _Signal2 = _interopRequireDefault(_Signal);

require("./polyfills");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loop = function () {
  function Loop(callback, scope, autoPlay) {
    _classCallCheck(this, Loop);

    this.onUpdate = new _Signal2.default();
    this.isPaused = true;
    this.frameId = 0;
    if (callback) {
      this.onUpdate.add(callback, scope);
      if (autoPlay || autoPlay === undefined) {
        this.play();
      }
    }
  }

  _createClass(Loop, [{
    key: "play",
    value: function play() {
      if (!this.isPaused) return;
      this.isPaused = false;
      this._onUpdate();
    }
  }, {
    key: "_onUpdate",
    value: function _onUpdate() {
      //can cause the loop to be paused
      this.onUpdate.dispatch(this.frameId);
      if (!this.isPaused) {
        this._requestFrame = requestAnimationFrame(this._onUpdate.bind(this));
      }
      this.frameId++;
    }
  }, {
    key: "pause",
    value: function pause() {
      this.isPaused = true;
      cancelAnimationFrame(this._requestFrame);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.onUpdate.dispose();
      this.pause();
    }
  }]);

  return Loop;
}();

exports.default = Loop;

},{"./Signal":41,"./polyfills":42}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require("../utils/Signal");

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getNumericStyleProperty(style, prop) {
  return parseInt(style.getPropertyValue(prop), 10);
}

function elementPosition(e) {
  var x = 0,
      y = 0;
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
  return { x: x, y: y };
}

var Mouse = function () {
  function Mouse(target) {
    _classCallCheck(this, Mouse);

    this.x = this.y = 0;
    this.isDown = false;
    this.isRightDown = false;
    this.target = target || document;

    this.onDown = new _Signal2.default();
    this.onUp = new _Signal2.default();
    this.onDrag = new _Signal2.default();

    this.onMiddleDown = new _Signal2.default();
    this.onMiddleDrag = new _Signal2.default();
    this.onMiddleUp = new _Signal2.default();

    this.onRightDown = new _Signal2.default();
    this.onRightDrag = new _Signal2.default();
    this.onRightUp = new _Signal2.default();

    this.onMove = new _Signal2.default();
    this.onWheel = new _Signal2.default();

    this._moveBind = this._onMouseMove.bind(this);
    this._downBind = this._onMouseDown.bind(this);
    this._upBind = this._onMouseUp.bind(this);
    this._wheelBind = this._onMouseWheel.bind(this);
    this._contextBind = function (e) {
      e.preventDefault();return false;
    };
    this._enabled = false;
    this.enable();
  }

  _createClass(Mouse, [{
    key: "enable",
    value: function enable() {
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
  }, {
    key: "disable",
    value: function disable() {
      this.target.removeEventListener("mousemove", this._moveBind);
      this.target.removeEventListener("mousedown", this._downBind);
      this.target.removeEventListener("mouseup", this._upBind);
      this.target.removeEventListener("mousewheel", this._wheelBind);
      this.target.removeEventListener("DOMMouseScroll", this._wheelBind);
      this.target.removeEventListener("contextmenu", this._contextBind);
      this._enabled = false;
    }
  }, {
    key: "_onMouseMove",
    value: function _onMouseMove(e) {
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
  }, {
    key: "_onMouseDown",
    value: function _onMouseDown(e) {
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
  }, {
    key: "_onMouseUp",
    value: function _onMouseUp(e) {
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
  }, {
    key: "_onMouseWheel",
    value: function _onMouseWheel(event) {
      var delta = 0;
      if (event.wheelDelta !== undefined) {
        delta = event.wheelDelta;
      } else if (event.detail !== undefined) {
        delta = -event.detail;
      }
      this.onWheel.dispatch(delta);
    }
  }, {
    key: "point",
    value: function point(pt) {
      pt = pt || {};
      pt.x = this.x;
      pt.y = this.y;
      return pt;
    }
  }, {
    key: "setCursor",
    value: function setCursor() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

      this.target.style.cursor = type;
    }
  }, {
    key: "dispose",
    value: function dispose() {
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
  }]);

  return Mouse;
}();

exports.default = Mouse;

},{"../utils/Signal":41}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("./polyfills");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Listener = function () {
  function Listener(signal, callback, scope, args) {
    _classCallCheck(this, Listener);

    this.callback = callback;
    this.scope = scope;
    this.args = args;
    this.once = false;
    this.executed = false;
  }

  _createClass(Listener, [{
    key: "exec",
    value: function exec(args) {
      this.callback.apply(this.scope, args.concat(this.args));
    }
  }]);

  return Listener;
}();

var Signal = function () {
  function Signal() {
    _classCallCheck(this, Signal);

    this.listeners = [];
  }

  _createClass(Signal, [{
    key: "add",
    value: function add(callback, scope) {
      if (callback === undefined) {
        throw new Error("no callback specified");
      }
      var n = this.listeners.length;
      for (var i = 0; i < n; i++) {
        var _listener = this.listeners[i];
        if (_listener.callback === callback && _listener.scope === scope) {
          return _listener;
        }
      }
      var args = Array.prototype.slice.call(arguments, 2);
      var listener = new Listener(this, callback, scope, args);
      this.listeners.unshift(listener);
      return listener;
    }
  }, {
    key: "addOnce",
    value: function addOnce(callback, scope) {
      var listener = this.add.apply(this, arguments);
      listener.once = true;
      return listener;
    }
  }, {
    key: "remove",
    value: function remove(callback, scope) {
      var n = this.listeners.length;
      for (var i = 0; i < n; i++) {
        var listener = this.listeners[i];
        if (listener.callback == callback && listener.scope == scope) {
          this.listeners.splice(i, 1);
          return;
        }
      }
    }
  }, {
    key: "removeListener",
    value: function removeListener(listener) {
      var id = this.listeners.indexOf(listener);
      if (id !== -1) {
        this.listeners.splice(id, 1);
      }
    }
  }, {
    key: "dispatch",
    value: function dispatch() {
      var args = Array.prototype.slice.call(arguments);
      var i = this.listeners.length;
      while (i--) {
        var listener = this.listeners[i];
        if (listener === undefined || listener.executed) {
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
        var _listener2 = this.listeners[i];
        if (_listener2 === undefined) {
          this.listeners.splice(i, 1);
        } else {
          _listener2.executed = false;
        }
      }
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.listeners = [];
    }
  }]);

  return Signal;
}();

exports.default = Signal;

},{"./polyfills":42}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (fn) {
  return setTimeout(fn, 50 / 3);
};

window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || function (id) {
  clearTimeout(id);
};

if (!Function.prototype.bind) {
  console.log("prototo");
  Function.prototype.bind = function (scope) {
    if (!method) throw new Error("no method specified");
    var args = Array.prototype.slice.call(arguments, 2);
    return function () {
      var params = Array.prototype.slice.call(arguments);
      method.apply(scope, params.concat(args));
    };
  };
}

if (window.console === undefined || console.log === undefined) {
  window.console = {
    log: function log() {}
  };
}

exports.default = {};

},{}]},{},[13]);

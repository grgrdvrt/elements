import * as api from "./api";
import Gui from "./gui/CompleteGui";

const gui = new Gui();
document.body.appendChild(gui.domElement);

const stage = gui.stage;

// let t1 = gui.ranPt();
// let t2 = gui.ranPt();
// let t3 = gui.ranPt();
// stage.add(t1, t2, t3);

// let s1 = api.segment(t1, t2);
// let s2 = api.segment(t1, t3);
// let s3 = api.segment(t2, t3);
// stage.add(s1, s2, s3);

// let m1 = api.segmentBissector(s1);
// let m2 = api.segmentBissector(s2);
// let m3 = api.segmentBissector(s3);
// stage.add(m1, m2, m3);

// stage.add(
//   api.middle(s1),
//   api.middle(s2),
//   api.middle(s3)
// );

// stage.add(api.linesIntersection(m1, m3));

// let c = api.circumCircle(t1, t2, t3);
// stage.add(c);


// let c1 = api.circle(gui.ranPt(), gui.ranPt());
// let inters = api.circlesIntersections(c1, c);
// stage.add(c1, c, inters);

// let pts = [];
// let nPts = 30;
// let w = stage.window;

// for(let i = 0; i < nPts; i++){
//   pts[i] = api.point(w.x + i / nPts * w.width, w.y + 0.5 * w.height);
// }
// let circles = pts.map((p, i) => {
//   return i === 0 ? null : api.circle(p, pts[i - 1]);
// });
// let intersections = circles.map((c, i) => {
//   return i < 2 ? null : api.circlesIntersections(c, circles[i - 1]);
// });
// let f = a => a.filter(o => o !== null);
// stage.add(f(pts), f(circles), f(intersections));


// stage.add(f(intersections).map(inter => api.segment(inter[0], inter[1])));

// let origin = api.point(0, 0);
// stage.add(api.vector(origin, api.point(1, 0)));
// stage.add(api.vector(origin, api.point(0, 1)));


let p1 = gui.ranPt();
let p2 = gui.ranPt();
let ci = api.circle(p1, p2);
stage.add(p1, p2, ci);

let pa = gui.ranPt();
let pb = gui.ranPt();
let pc = gui.ranPt();
let pd = gui.ranPt();

let sa = api.segment(pa, pb);
let sb = api.segment(pb, pc);
let sc = api.segment(pc, pd);
let sd = api.segment(pd, pa);

let ma = api.middle(sa);
let mb = api.middle(sb);
let mc = api.middle(sc);
let md = api.middle(sd);

stage.add(pa, pb, pc, pd);
stage.add(ma, mb, mc, md);
stage.add(sa, sb, sc, sd);

stage.add(api.polygon(ma, mb, mc, md));
// gui.start(timeStamp => {
//     pts.forEach((p, i) => p.geom.y = 0.1 * w.height * Math.cos(0.5 * i + 0.03 * timeStamp));
// });


// const pts = [];
// for(let i = 0; i < 500; i++) pts.push(gui.ranPt())
// stage.add(pts.map(pt => api.circle(pt, gui.mouse)));

gui.start();

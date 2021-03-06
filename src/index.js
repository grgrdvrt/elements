import * as api from "./api";
import Gui from "./gui/CompleteGui";

const gui = new Gui();
document.body.appendChild(gui.domElement);
const stage = gui.stage;

/** circum circle **/
// const t1 = gui.randPt();
// const t2 = gui.randPt();
// const t3 = gui.randPt();
// stage.add(t1, t2, t3);

// const s1 = api.segment(t1, t2);
// const s2 = api.segment(t1, t3);
// const s3 = api.segment(t2, t3);
// stage.add(s1, s2, s3);

// const m1 = api.segmentBissector(s1);
// const m2 = api.segmentBissector(s2);
// const m3 = api.segmentBissector(s3);
// stage.add(m1, m2, m3);

// stage.add(
//   api.middle(s1),
//   api.middle(s2),
//   api.middle(s3)
// );

// stage.add(api.intersection(m1, m3));
// const circum = api.circle(t1, t2, t3);
// stage.add(circum);

// const p1 = gui.randPt();
// const p2 = gui.randPt();
// const l = api.line(p1, p2);
// stage.add(p1, p2, l, api.intersection(l, circum));

// stage.add(api.functionGraph(x => Math.cos(x)));
// stage.add(api.functionGraph(x => Math.tan(x)));
// stage.add(api.functionGraph(x => 1 / x));


// const c1 = api.circle(gui.randPt(), gui.randPt());
// const c2 = api.circle(gui.randPt(), gui.randPt());
// let inters = api.circlesIntersections(c1, c2);
// stage.add(c1, c2, inters);

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

/** frame**/
// let origin = api.point(0, 0);
// stage.add(api.vector(origin, api.point(1, 0)));
// stage.add(api.vector(origin, api.point(0, 1)));


/** Circle point point**/
// let p1 = gui.randPt();
// let p2 = gui.randPt();
// let ci = api.circle(p1, p2);
// stage.add(p1, p2, ci);
``

/**VARIGNON**/
// let pa = gui.randPt();
// let pb = gui.randPt();
// let pc = gui.randPt();
// let pd = gui.randPt();

// let sa = api.segment(pa, pb);
// let sb = api.segment(pb, pc);
// let sc = api.segment(pc, pd);
// let sd = api.segment(pd, pa);

// let ma = api.middle(sa);
// let mb = api.middle(sb);
// let mc = api.middle(sc);
// let md = api.middle(sd);

// stage.add(pa, pb, pc, pd);
// stage.add(ma, mb, mc, md);
// stage.add(sa, sb, sc, sd);

// stage.add(api.polygon(ma, mb, mc, md));


// gui.start(timeStamp => {
//     pts.forEach((p, i) => p.geom.y = 0.1 * w.height * Math.cos(0.5 * i + 0.03 * timeStamp));
// });


const pts = [];
const pt = gui.randPt();
for(let i = 0; i < 500; i++) pts.push(gui.randPt());
stage.add(pt, pts.map(p => api.circle(p, pt)));


// const pt = gui.randPt();
// stage.add(pt, api.circle(pt, api.scalar(0.15)));

gui.start();

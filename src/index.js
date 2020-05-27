import * as api from "./api";
import Gui from "./gui/CompleteGui";

const gui = new Gui();
document.body.appendChild(gui.domElement);

const stage = gui.stage;

/** circum circle **/
// const t1 = gui.ranPt();
// const t2 = gui.ranPt();
// const t3 = gui.ranPt();
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

// stage.add(api.linesIntersection(m1, m3));
// stage.add(api.circle(t1, t2, t3));

// stage.add(api.functionGraph(x => Math.cos(x)));
// stage.add(api.functionGraph(x => Math.tan(x)));
// stage.add(api.functionGraph(x => 1 / x));


// const c1 = api.circle(gui.ranPt(), gui.ranPt());
// const c2 = api.circle(gui.ranPt(), gui.ranPt());
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
let origin = api.point(0, 0);
stage.add(api.vector(origin, api.point(1, 0)));
stage.add(api.vector(origin, api.point(0, 1)));


/** Circle point point**/
// let p1 = gui.ranPt();
// let p2 = gui.ranPt();
// let ci = api.circle(p1, p2);
// stage.add(p1, p2, ci);

/**VARIGNON**/
// let pa = gui.ranPt();
// let pb = gui.ranPt();
// let pc = gui.ranPt();
// let pd = gui.ranPt();

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


// const pts = [];
// for(let i = 0; i < 500; i++) pts.push(gui.ranPt())
// stage.add(pts.map(pt => api.circle(pt, gui.mouse)));

const angle = api.scalar(Math.random() * 2 * Math.PI);
/** transforms **/
{
    const pt = gui.ranPt();
    stage.add(pt);

    const circleCenter = gui.ranPt();
    const circle = api.circle(circleCenter, gui.ranPt());
    stage.add(circleCenter, circle);

    const linePt = gui.ranPt();
    const line = api.line(linePt, gui.ranPt());
    stage.add(linePt, line);

    /** translations **/
    // {
    //     const vec = api.vector(gui.ranPt(), gui.ranPt());
    //     vec.style.stroke = "red";
    //     stage.add(vec);

    //     const pRep = api.vectorRepresentant(vec, pt);
    //     pRep.style.stroke = "blue";
    //     const transP = api.translate(pt, vec);
    //     transP.style.fill = "red";
    //     stage.add(pt, pRep, transP);

    //     const cRep = api.vectorRepresentant(vec, circleCenter);
    //     cRep.style.stroke = "blue";
    //     const transC = api.translate(circle, vec);
    //     transC.style.stroke = "red";
    //     stage.add(circleCenter, circle, cRep, transC);

    //     const lRep = api.vectorRepresentant(vec, linePt);
    //     lRep.style.stroke = "blue";
    //     const transL = api.translate(line, vec);
    //     transL.style.stroke = "red";
    //     stage.add(lRep, transL);
    // }

    /** rotations **/
    {
        const center = gui.ranPt();
        center.style.fill = "blue";
        stage.add(center);


        const rotPt = api.rotate(pt, center, angle);
        rotPt.style.fill = "red";
        const rcp = api.circle(center, pt);
        rcp.style.stroke = "blue";
        const rotCircle = api.rotate(circle, center, angle);
        rotCircle.style.stroke = "red";
        const rcc = api.circle(center, circleCenter);
        rcc.style.stroke = "blue";
        const rotLine = api.rotate(line, center, angle);
        rotLine.style.stroke = "red";
        const rcl = api.circle(center, linePt);
        rcl.style.stroke = "blue";
        stage.add(rcp, rcc, rcl);
        stage.add(rotPt, rotCircle, rotLine);
    }
}


gui.start(() => {angle.value = angle.value + 0.1 * Math.PI});

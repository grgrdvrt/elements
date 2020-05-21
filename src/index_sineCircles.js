import * as api from "./api";
import Gui from "./gui/CompleteGui";

const gui = new Gui({
    autoStart:false,
});
document.body.appendChild(gui.domElement);

const stage = gui.stage;

const nPts = 30;
const w = stage.window;
const pts = [];
for(let i = 0; i < nPts; i++){
  pts[i] = api.point(w.x + i / nPts * w.width, w.y + 0.5 * w.height);
}
const circles = pts.slice(1).map((p, i) => api.circle(p, pts[i]));
const intersections = circles.slice(1).map((c, i) => {
  return api.circlesIntersections(c, circles[i]);
});
stage.add(pts, circles, intersections);
// stage.add(pts, circles);

// stage.add(intersections.map(inter => api.segment(inter[0], inter[1])));
stage.add(intersections.slice(1).map((inter, i) => [
    api.segment(inter[0], intersections[i][0]),
    api.segment(inter[1], intersections[i][1]),
]));


circles.forEach(c => {
    const r = Math.round(Math.random() * 0xff);
    const g = Math.round(Math.random() * 0xff);
    const b = Math.round(Math.random() * 0xff);
    // c.style.fill = `rgba(${r}, ${g}, ${b}, 0.1)`;
    // c.style.stroke = undefined;
})
let origin = api.point(0, 0);
// stage.add(api.vector(origin, api.point(1, 0)));
// stage.add(api.vector(origin, api.point(0, 1)));



api.regularPolygon(api.point(0, 0), api.point(1, 2))

gui.start(timeStamp => {
    pts.forEach((p, i) => p.geom.y = 0.35 * Math.cos(0.5 * i + 0.001 * timeStamp));
});

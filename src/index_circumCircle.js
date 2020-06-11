import * as api from "./api";
import Gui from "./gui/CompleteGui";

const gui = new Gui();
document.body.appendChild(gui.domElement);

const stage = gui.stage;

const t1 = gui.randPt();
const t2 = gui.randPt();
const t3 = gui.randPt();
stage.add(t1, t2, t3);

const s1 = api.segment(t1, t2);
const s2 = api.segment(t1, t3);
const s3 = api.segment(t2, t3);
stage.add(s1, s2, s3);

const m1 = api.segmentBissector(s1);
const m2 = api.segmentBissector(s2);
const m3 = api.segmentBissector(s3);
stage.add(m1, m2, m3);

stage.add(
  api.middle(s1),
  api.middle(s2),
  api.middle(s3)
);

stage.add(api.linesIntersection(m1, m3));

const c = api.circumCircle(t1, t2, t3);
stage.add(c);

gui.start(timeStamp => {});


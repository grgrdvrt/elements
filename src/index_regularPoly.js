import * as api from "./api";
import Gui from "./gui/CompleteGui";
import {lerp} from "./maths";

const gui = new Gui({
    autoStart:false,
    // autoSize:false
});
document.body.appendChild(gui.domElement);

const stage = gui.stage;

// for(let i = 0; i < 10; i++){
//     const p1 = gui.ranPt();
//     const p2 = gui.ranPt();
//     p2.geom.sub(p1.geom).multiplyScalar(0.1).add(p1.geom);
//     stage.add(p1, p2);
//     stage.add(api.regularPolygon(p1, p2, Math.round(lerp(3, 8, Math.random()))))
// }

const p1 = gui.ranPt();
const p2 = gui.ranPt();
const p3 = gui.ranPt();
stage.add(p1, p2, p3)

const s1 = api.segment(p2, p3);
const s2 = api.segment(p1, p3);
const s3 = api.segment(p1, p2);
stage.add(s1, s2, s3);

stage.add(
    api.segment(p1, api.middle(s1)),
    api.segment(p2, api.middle(s2)),
    api.segment(p3, api.middle(s3)),
)


gui.start();

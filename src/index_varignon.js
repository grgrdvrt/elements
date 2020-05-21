import * as api from "./api";
import Gui from "./gui/CompleteGui";

let gui = new Gui();
document.body.appendChild(gui.domElement);

let stage = gui.stage;

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

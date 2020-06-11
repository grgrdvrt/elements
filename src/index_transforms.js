import * as api from "./api";
import Gui from "./gui/CompleteGui";

const gui = new Gui();
document.body.appendChild(gui.domElement);

const stage = gui.stage;


const angle = api.scalar(Math.random() * 2 * Math.PI);
/** transforms **/
{
    const pt = gui.randPt();
    stage.add(pt);

    const circleCenter = gui.randPt();
    const circle = api.circle(circleCenter, gui.randPt());
    stage.add(circleCenter, circle);

    const linePt = gui.randPt();
    const line = api.line(linePt, gui.randPt());
    stage.add(linePt, line);

    /** translations **/
    // {
    //     const vec = api.vector(gui.randPt(), gui.randPt());
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
        const center = gui.randPt();
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

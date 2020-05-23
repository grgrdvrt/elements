import SelectOrCreatePoint from "./SelectOrCreatePoint";
import {circumCircle} from "../../constructions/circle";
export default class CircumCircle{
    constructor(stage, mouse){
        let p1, p2;
        const commands = {
            p1:SelectOrCreatePoint,
            p2:SelectOrCreatePoint,
            result:circumCircle(p1, p2, mouse)
        }
    }
}

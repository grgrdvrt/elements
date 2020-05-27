import {
    Vector2,
    lerp
} from "../../maths";

export function drawPoint(stage, point){
    const radius = 5;
    const x = point.geom.x;
    const y = point.geom.y;

    const ctx = stage.ctx;

    ctx.beginPath();
    const s = stage.scale;
    const t = stage.translation;
    ctx.moveTo(t.x + x * s.x + radius, t.y + y * s.y);
    ctx.arc(t.x + x * s.x, t.y + y * s.y, radius, 0, 2 * Math.PI);

    const style = point.style;
    ctx.save();
    if(style.stroke!== undefined){
        ctx.strokeStyle = style.stroke.toString();
        if(style.dash !== undefined){
            ctx.setLineDash(style.dash);
        }
        ctx.stroke();
    }
    if(style.fill !== undefined){
        ctx.fillStyle = style.fill.toString();
        ctx.fill();
    }
    ctx.restore();
}

export function drawCircle(stage, circle){
    const c = circle.geom.center;
    const r = circle.geom.radius;

    const ctx = stage.ctx;
    ctx.beginPath();
    ctx.save();
    ctx.translate(stage.translation.x, stage.translation.y);
    ctx.scale(stage.scale.x, stage.scale.y);
    ctx.moveTo(c.x + r, c.y);
    ctx.arc(c.x, c.y, r, 0, 2 * Math.PI);
    ctx.restore();
    ctx.save();

    const style = circle.style;
    if(style.stroke!== undefined){
        ctx.strokeStyle = style.stroke.toString();
        if(style.dash !== undefined){
            ctx.setLineDash(style.dash);
        }
        ctx.stroke();
    }
    if(style.fill!== undefined){
        ctx.fillStyle = style.fill.toString();
        ctx.fill();
    }
    ctx.restore();
}

export function drawSegment(stage, segment){
    const ctx = stage.ctx;
    const p1 = segment.geom.p1;
    const p2 = segment.geom.p2;
    ctx.beginPath();
    ctx.save();
    ctx.translate(stage.translation.x, stage.translation.y);
    ctx.scale(stage.scale.x, stage.scale.y);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.restore();

    const style = segment.style;
    ctx.save();
    if(style.stroke!== undefined){
        ctx.strokeStyle = style.stroke.toString();
        ctx.stroke();
        if(style.dash !== undefined){
            ctx.setLineDash(style.dash);
        }
    }
    ctx.restore();
}

export function drawLine(stage, line){
    const l = line.geom;
    const ctx = stage.ctx;
    ctx.beginPath();
    const w = stage.window;
    ctx.save();
    ctx.translate(stage.translation.x, stage.translation.y);
    ctx.scale(stage.scale.x, stage.scale.y);
    if(l.vector.x === 0){
        ctx.moveTo(l.point.x, w.y);
        ctx.lineTo(l.point.x, w.y + w.height);
    }
    else {
        ctx.moveTo(w.x, l.getYFromX(w.x));
        ctx.lineTo(w.x + w.width, l.getYFromX(w.x + w.width));
    }
    ctx.restore();

    const style = line.style;
    ctx.save();
    if(style.stroke !== undefined){
        ctx.strokeStyle = style.stroke.toString();
        if(style.dash !== undefined){
            ctx.setLineDash(style.dash);
        }
        ctx.stroke();
    }
    ctx.restore();
}

export function drawVector(stage, vector){
    const ctx = stage.ctx;
    const p1 = vector.geom.p1;
    const p2 = vector.geom.p2;
    ctx.beginPath();
    ctx.save();
    ctx.translate(stage.translation.x, stage.translation.y);
    ctx.scale(stage.scale.x, stage.scale.y);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.restore();
    const style = vector.style;
    ctx.save();
    if(style.stroke!== undefined){
        ctx.strokeStyle = style.stroke.toString();
        if(style.dash !== undefined){
            ctx.setLineDash(style.dash);
        }
        ctx.stroke();
    }
    ctx.restore();


    ctx.save();
    ctx.translate(stage.translation.x, stage.translation.y);
    ctx.scale(stage.scale.x, stage.scale.y);
    const arrowLength = 5 / stage.scale.x;
    const arrowWidth = 5 / stage.scale.x;
    const end = p2;
    const diff = p2.clone().sub(p1);

    const length = diff.clone().setLength(arrowLength);
    const width = diff.clone().setLength(arrowWidth);
    const end2 = end.clone().sub(length);

    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end2.x + width.y, end2.y - width.x);
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end2.x - width.y, end2.y + width.x);
    ctx.restore();


    ctx.save();
    if(style.stroke!== undefined){
        ctx.strokeStyle = style.stroke.toString();
        ctx.stroke();
    }
    ctx.restore();
}

export function drawPolygon(stage, polygon){
    const ctx = stage.ctx;
    ctx.beginPath();
    ctx.save();
    ctx.translate(stage.translation.x, stage.translation.y);
    ctx.scale(stage.scale.x, stage.scale.y);
    const pts = polygon.geom;
    const n = pts.length;
    let p = pts[n - 1];
    ctx.moveTo(p.x, p.y);
    for(let i = 0; i < n; i++){
        p = pts[i];
        ctx.lineTo(p.x, p.y);
    }
    ctx.restore();

    const style = polygon.style;
    ctx.save();
    if(style.stroke!== undefined){
        ctx.strokeStyle = style.stroke.toString();
        if(style.dash !== undefined){
            ctx.setLineDash(style.dash);
        }
        ctx.stroke();
    }
    if(style.fill!== undefined){
        ctx.fillStyle = style.fill.toString();
        ctx.fill();
    }
    ctx.restore();
}


export function drawFuncGraph(stage, func){
    const ctx = stage.ctx;
    ctx.beginPath();
    const w = stage.window;
    ctx.save();
    ctx.translate(stage.translation.x, stage.translation.y);
    ctx.scale(stage.scale.x, stage.scale.y);
    let prev = {x:w.x, y:func.input.func(w.x)};
    let isPrevVisible = w.contains(prev.x, prev.y);
    ctx.moveTo(prev.x, prev.y);
    const nSteps = stage.scale.x * w.width;
    for(let i = 0; i < nSteps; i++){
        const x = w.x + lerp(0, w.width, i / nSteps);
        const val = func.input.func(x);
        const isValVisible = w.contains(x, val);
        if(isPrevVisible){
            ctx.lineTo(x, val);
            isPrevVisible = isValVisible;
        }
        else if(isValVisible){
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(x, val);
            isPrevVisible = true;
        }
        else{
            isPrevVisible = false;
        }
        prev = {x:x, y:val};
    }
    ctx.restore();

    const style = func.style;
    ctx.save();
    if(style.stroke !== undefined){
        ctx.strokeStyle = style.stroke.toString();
        if(style.dash !== undefined){
            ctx.setLineDash(style.dash);
        }
        ctx.stroke();
    }
    ctx.restore();
}

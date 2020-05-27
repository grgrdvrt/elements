export * from "./point";
export * from "./line";
export * from "./circle";
export * from "./segment";
export * from "./functionGraph";
export * from "./scalar";
export * from "./vector";
export * from "./polygon";
export * from "./functionGraph";

import {
    makeDispatch
} from "../api/types";

import {
    pointTranslation,
    pointRotation,
    pointHomothecy
} from "./point";
import {
    circleTranslation,
    circleRotation,
    circleHomothecy
} from "./circle";
import {
    lineTranslation,
    lineRotation,
    lineHomothecy
} from "./line";

export const translate = makeDispatch(
    pointTranslation,
    circleTranslation,
    lineTranslation,
);

export const rotate = makeDispatch(
    pointRotation,
    circleRotation,
    lineRotation,
);

export const homothecy = makeDispatch(
    pointHomothecy,
    circleHomothecy,
    lineHomothecy,
);

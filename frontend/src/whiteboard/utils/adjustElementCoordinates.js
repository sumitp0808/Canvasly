import { toolTypes } from "../constants";

export const adjustElementCoordinates = (element) => {
    const {type, x1, y1, x2, y2} = element;

    if(type == toolTypes.RECTANGLE) {
        const minx = Math.min(x1, x2);
        const maxx = Math.max(x1, x2);
        const miny = Math.min(y1, y2)
        const maxy = Math.max(y1, y2);

        return {x1: minx, y1: miny, x2: maxx, y2: maxy};
    }

    if(type == toolTypes.LINE) {
        if(x1 < x2 || (x1 === x2 && y1 < y2)) {
            //drawing from l2r
            return {x1,y1,x2,y2};
        } else {
            return {
                x1: x2,
                y1: y2,
                x2: x1,
                y2: y1,
            }
        }
    }
}
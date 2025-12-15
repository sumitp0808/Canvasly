import { toolTypes } from "../constants";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "./getSVGPathFromStroke";

const drawPencilElement = (context, element) => {
    //vary specifics later
    const myStroke = getStroke(element.points, {
  size: 4,
  thinning: 0.6,
  smoothing: 0.8,
  streamline: 0.5,
  easing: (t) => t,
  simulatePressure: true,  
  start: { taper: 0 },
  end: { taper: 0 },
});

const pathData = getSvgPathFromStroke(myStroke);

const myPath = new Path2D(pathData);
//fill styles will go here
context.fillStyle = "orange";
context.fill(myPath);

};

const drawTextElement = (context, element) => {
    context.textBaseline = "top";
    context.fillStyle = "green";
    context.font = '24px sans-serif';      //can vary text-styling later
    context.fillText(element.text, element.x1, element.y1);
};

export const drawElement = ({roughCanvas, context, element}) => {
    switch(element.type) {
        case toolTypes.RECTANGLE:
        case toolTypes.LINE:
        case toolTypes.ELLIPSE:
            return roughCanvas.draw(element.roughElement);   //same4 rect&line
        case toolTypes.PENCIL:
            drawPencilElement(context, element);
            break;
        case toolTypes.TEXT:
            drawTextElement(context, element);
            break;
        default:
            throw new Error("couldnt draW that");
    }
};
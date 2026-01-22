import rough from "roughjs";
import { toolTypes } from "../constants"; 

const generator = rough.generator();

const generateRectangle = ({x1, y1, x2, y2, strokeColor, strokeWidth}) => {
    return generator.rectangle(x1, y1, x2-x1, y2-y1, {
        stroke: strokeColor,                  //will vary later using GUI
        strokeWidth: strokeWidth,
    });
};

const generateLine = ({x1, y1, x2, y2, strokeColor, strokeWidth}) => {
    return generator.line(x1, y1, x2, y2, {
        stroke: strokeColor,
        strokeWidth: strokeWidth,                  //will vary later
    });
};

const generateEllipse = ({x1, y1, x2, y2, strokeColor, strokeWidth}) => {
    const width = Math.abs(x2-x1);
    const height = Math.abs(y2-y1);

    const centerX = x1 + (x2-x1)/2;
    const centerY = y1 + (y2-y1)/2;

    return generator.ellipse(centerX, centerY, width, height, {
        stroke : strokeColor,         //will vary later
        strokeWidth,
    });
}

export const createElement = ({x1, y1, x2, y2, toolType, id, text, strokeColor, strokeWidth}) => {
    let roughElement;

    switch(toolType) {
        case toolTypes.RECTANGLE:
            roughElement = generateRectangle({x1, y1, x2, y2, strokeColor, strokeWidth});
            return {
                id: id,
                roughElement,
                type: toolType,
                x1, 
                y1,
                x2,
                y2,
                strokeColor,
                strokeWidth,
            };
        case toolTypes.ELLIPSE:
            roughElement = generateEllipse({x1, y1, x2, y2, strokeColor, strokeWidth});
            return {
                id,
                roughElement,
                type: toolType,
                x1,
                y1,
                x2,
                y2,
                strokeColor,
                strokeWidth,
            };
        case toolTypes.LINE:
            roughElement = generateLine({x1, y1, x2, y2, strokeColor, strokeWidth});
            return {
                id: id,
                roughElement,
                type: toolType,
                x1, 
                y1,
                x2,
                y2,
                strokeColor,
                strokeWidth,
            };
        case toolTypes.PENCIL:
            return {
                id,
                type: toolType,
                points: [{x: x1, y: y1}],
                strokeColor,
                strokeWidth,
                strokeWidth,
            };
        case toolTypes.TEXT:
            return {
                id,
                type: toolType,
                x1,
                y1,
                x2,
                y2,
                text: text || "",
                strokeColor,
            }
        default:
            throw new Error("No valid toolType");
    }
};
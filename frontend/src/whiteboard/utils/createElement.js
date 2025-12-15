import rough from "roughjs";
import { toolTypes } from "../constants"; 

const generator = rough.generator();

const generateRectangle = ({x1, y1, x2, y2}) => {
    return generator.rectangle(x1, y1, x2-x1, y2-y1, {
        stroke:"blue",                  //will vary later using GUI
    });
};

const generateLine = ({x1, y1, x2, y2}) => {
    return generator.line(x1, y1, x2, y2, {
        stroke:"red",                  //will vary later
    });
};

const generateEllipse = ({x1, y1, x2, y2}) => {
    const width = Math.abs(x2-x1);
    const height = Math.abs(y2-y1);

    const centerX = x1 + (x2-x1)/2;
    const centerY = y1 + (y2-y1)/2;

    return generator.ellipse(centerX, centerY, width, height, {
        stroke : "purple",         //will vary later
    });
}

export const createElement = ({x1, y1, x2, y2, toolType, id, text}) => {
    let roughElement;

    switch(toolType) {
        case toolTypes.RECTANGLE:
            roughElement = generateRectangle({x1, y1, x2, y2});
            return {
                id: id,
                roughElement,
                type: toolType,
                x1, 
                y1,
                x2,
                y2,
            };
        case toolTypes.ELLIPSE:
            roughElement = generateEllipse({x1, y1, x2, y2});
            return {
                id,
                roughElement,
                type: toolType,
                x1,
                y1,
                x2,
                y2,
            };
        case toolTypes.LINE:
            roughElement = generateLine({x1, y1, x2, y2});
            return {
                id: id,
                roughElement,
                type: toolType,
                x1, 
                y1,
                x2,
                y2,
            };
        case toolTypes.PENCIL:
            return {
                id,
                type: toolType,
                points: [{x: x1, y: y1}],
            };
        case toolTypes.TEXT:
            return {
                id,
                type: toolType,
                x1,
                y1,
                text: text || ""
            }
        default:
            throw new Error("No valid toolType");
    }
};
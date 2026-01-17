import { toolTypes } from "../constants";

export  const adjustmentRequired = (type) => 
    [toolTypes.RECTANGLE, toolTypes.LINE, toolTypes.ELLIPSE].includes(type);

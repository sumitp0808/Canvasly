import Toolbar from "./ToolBar"
import { useRef, useLayoutEffect, useState} from "react";
import rough from "roughjs";
import { useSelector, useDispatch } from "react-redux";
import { toolTypes, actions } from "./constants";
import { adjustElementCoordinates, adjustmentRequired, createElement , drawElement, updateElement} from "./utils";
import {v4 as uuid} from 'uuid';
import {updateElement as updateElementInStore} from "./whiteboardSlice";


const Whiteboard = () => {
  const canvasRef = useRef();
  const toolType = useSelector((state) => state.whiteboard.tool);
  const elements = useSelector((state) => state.whiteboard.elements);

  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);
    
    elements.forEach((element) => {
      drawElement({roughCanvas, context: ctx, element});
    });

  }, [elements]);

  const handleMouseDown = (event) => {
    const {clientX, clientY} = event;

    const element = createElement({
      x1: clientX,
      y1: clientY,
      x2: clientX,
      y2: clientY,
      toolType,
      id: uuid(),
    });

    switch(toolType){
      case toolTypes.RECTANGLE:
      case toolTypes.LINE:
      case toolTypes.PENCIL: {
        setAction(actions.DRAWING);
        break;
      }
      case toolTypes.TEXT: {
        setAction(actions.WRITING);
        break;
      }
    }

    setSelectedElement(element);

    dispatch(updateElementInStore(element));

  };

  const handleMouseUp = () => {
    const selectedElementIndex = elements.findIndex(el => el.id === selectedElement.id);

    if(selectedElementIndex !== -1){
      if(action === actions.DRAWING){
        if(adjustmentRequired(elements[selectedElementIndex].type)){
          const {x1, y1, x2, y2} = adjustElementCoordinates(elements[selectedElementIndex]);

          updateElement({
            id: selectedElement.id,
            index: selectedElementIndex,
            x1,
            y1,
            x2,
            y2,
            type: elements[selectedElementIndex].type,
          }, elements);
        }
      }
    }

    setAction(null);
    setSelectedElement(null);
  }

  const handleMouseMove = (event) => {
    const {clientX, clientY} = event;

    if(action == actions.DRAWING){
      //find ind of selected el
      const index = elements.findIndex(el => el.id === selectedElement.id)

      if(index !== -1){
        updateElement({
          index,
          id: elements[index].id,
          x1: elements[index].x1,
          y1: elements[index].y1,
          x2: clientX,
          y2: clientY,
          type: elements[index].type,
        }, elements);
      }
    }
  };

  return (
    <>
        <Toolbar />
        <canvas 
          ref = {canvasRef}
          width = {window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
    </>
  )
}

export default Whiteboard
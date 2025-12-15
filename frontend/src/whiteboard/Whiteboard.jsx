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
  const textareaRef = useRef(); // for text insertion tool

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

    //to avoid final replacement of text(near last click) on blur
    if(selectedElement && action === actions.WRITING){
      return;
    }

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
    const selectedElementIndex = elements.findIndex(el => el.id === selectedElement?.id);

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

  const handleTextareaOnBlur = (event) => {
    const {id, x1, y1, type } = selectedElement;
    const index = elements.findIndex(el => el.id === selectedElement.id)
    if(index != -1){
      updateElement({id, x1, y1, type, text: event.target.value, index}, 
        elements
      );

      setAction(null);
      setSelectedElement(null);
    }
  };

  return (
    <>
        <Toolbar />
        {action === actions.WRITING ? (
          <textarea 
          ref = {textareaRef}
          onBlur={handleTextareaOnBlur}
          style={{
            position: 'absolute',
            top: selectedElement.y1-3,
            left: selectedElement.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whitespace: "pre",
            background: "transparent",
          }}
        />
        ) : null } 
        <canvas 
          ref = {canvasRef}
          width = {window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          id='canvas'
        />
    </>
  )
}

export default Whiteboard
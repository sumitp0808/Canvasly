import { store } from "../store/store";
import Toolbar from "./tools/ToolBar"
import { useRef, useLayoutEffect, useState, useEffect} from "react";
import rough from "roughjs";
import { useSelector, useDispatch } from "react-redux";
import { toolTypes, actions, cursorPositions } from "./constants";
import { adjustElementCoordinates, adjustmentRequired, createElement , drawElement, updateElement, getElementAtPosition, getCursorForPosition, getResizedCoordinates, updatePencilElementWhenMoving} from "./utils";
import {v4 as uuid} from 'uuid';
import {updateElement as updateElementInStore} from "./whiteboardSlice";
import { pushToHistory, undo, redo } from "./whiteboardSlice";
import { emitCursorPosition, emitFullState } from "../socketConn/socketConn";

//for cursors
let emitCursor = true;
let lastCursorPosition;

const Whiteboard = () => {
  const user = useSelector((state) => state.user);
  const strokeColor = useSelector((state) => state.whiteboard.strokeColor);

  const canvasRef = useRef();
  const textareaRef = useRef(); // for text insertion tool

  const toolType = useSelector((state) => state.whiteboard.tool);
  const elements = useSelector((state) => state.whiteboard.elements);

  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  const dispatch = useDispatch();

  //to allow undo redo by shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        dispatch(undo());
        emitFullState(store.getState().whiteboard.elements);
      }
      if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
        e.preventDefault();
        dispatch(redo());
        emitFullState(store.getState().whiteboard.elements);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);


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


    switch(toolType){
      case toolTypes.RECTANGLE:
      case toolTypes.ELLIPSE:
      case toolTypes.LINE:
      case toolTypes.PENCIL: {
        dispatch(pushToHistory()); //has tool selectd & mouseDown

        const element = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType,
          id: uuid(),
          strokeColor,
        });
        setAction(actions.DRAWING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;
      }
      case toolTypes.TEXT: {
        dispatch(pushToHistory()); //has tool selectd & mouseDown

        const element = createElement({
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY,
        toolType,
        id: uuid(),
        strokeColor,
        });

        setAction(actions.WRITING);
        setSelectedElement(element);
        dispatch(updateElementInStore(element));
        break;
      }
      case toolTypes.SELECTION: {
        dispatch(pushToHistory()); //has tool selectd & mouseDown

        const element = getElementAtPosition(clientX, clientY, elements)
        
        //for shapes
        if(element && (element.type === toolTypes.RECTANGLE || element.type === toolTypes.ELLIPSE || element.type === toolTypes.TEXT || element.type === toolTypes.LINE)){
          setAction(element.position === cursorPositions.INSIDE ? actions.MOVING : actions.RESIZING);

          const offsetX = clientX - element.x1; //how far from top and left side
          const offsetY = clientY - element.y1;

          setSelectedElement({...element, offsetX, offsetY});
        }
        //for freehand drawing
        if(element && element.type == toolTypes.PENCIL){
          setAction(actions.MOVING)
          //there are many points => all points offset
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);

          setSelectedElement({ ...element, xOffsets, yOffsets});
        }

        break;
      }
    }
  };

  const handleMouseUp = () => {
    const selectedElementIndex = elements.findIndex(el => el.id === selectedElement?.id);

    if(selectedElementIndex !== -1){
      if(action === actions.DRAWING || action == actions.RESIZING){
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

    //cursor update

    lastCursorPosition = {x: clientX, y: clientY, name: user.name};
    if(emitCursor) {
      emitCursorPosition({x: clientX, y: clientY, name: user.name});
      emitCursor = false;

      //updating cursor position only after some delay
      setTimeout(() => {
        emitCursor = true;
        emitCursorPosition(lastCursorPosition);
      }, [100]);
    }


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

    if(toolType == toolTypes.SELECTION){
      const element = getElementAtPosition(clientX, clientY, elements);

      event.target.style.cursor = element ? getCursorForPosition(element.position) : "default";

      if(selectedElement && toolType == toolTypes.SELECTION && action == actions.MOVING && selectedElement.type == toolTypes.PENCIL){
        const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }));

        const index = elements.findIndex((el) => el.id === selectedElement.id);
        
        if(index !== -1){
          updatePencilElementWhenMoving({
            index,
            newPoints,
          }, elements);
        }
        
        return;  //to skip next if execution
      }

      if(toolType === toolTypes.SELECTION && action === actions.MOVING && selectedElement){
        const {id, x1, x2, y1, y2, type, offsetX, offsetY, text} = selectedElement;

        const width = x2-x1;      //width & height
        const height = y2- y1;    //remains const on shifting

        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;

        const selectedElementIndex = elements.findIndex((el) => el.id === selectedElement.id);

        if(selectedElementIndex !== -1){
          updateElement({
            id, 
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type,
            index: selectedElementIndex,
            text,
          }, elements);
        }
      }
    }

    if(toolType == toolTypes.SELECTION && action == actions.RESIZING && selectedElement){
      const {id, type, position, ...coordinates } = selectedElement;

      const {x1, y1, x2, y2} = getResizedCoordinates(clientX, clientY, position, coordinates);

      const selectedElementIndex = elements.findIndex((el) => el.id === selectedElement.id);

      if(selectedElementIndex !== -1){
        updateElement({
          id,
          x1,
          x2,
          y1,
          y2,
          type,
          index: selectedElementIndex,
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
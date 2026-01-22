import { toolTypes } from '../constants';
import {useDispatch, useSelector} from 'react-redux';
import { undo, redo } from '../whiteboardSlice';
import { store } from '../../store/store';

import {
FaPencilAlt,
FaUndo,
FaRedo,
FaEraser,
FaMousePointer,
} from 'react-icons/fa';
import { BsSquare, BsCircle, BsSlash } from 'react-icons/bs';
import { MdDeleteSweep, MdTextFields } from "react-icons/md";


import { setToolType, setElements, pushToHistory } from '../whiteboardSlice';
import { emitClearWhiteboard, emitFullState } from '../../socketConn/socketConn';
import ColorPickerTool from './ColorPickerTool';
import StrokeWidthTool from './StrokeWidthTool';
import FillTool from './fillTool/FillTool';

const IconButton = ({icon, type}) => {
  const dispatch = useDispatch();
  const activeTool = useSelector((state) => state.whiteboard.tool);

  const handleToolChange = () => {
    dispatch(setToolType(type));
  };

  const isActive = activeTool == type;
  
  return (
    <button onClick = {handleToolChange} title={type} 
      className={`flex items-center justify-center text-lg p-2 rounded-full transition-all duration-300 ease-in-out
        ${
          isActive
            ? 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-400/40 scale-110'
            : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:scale-105'
        }`}
    >
      {icon}
    </button>
  );
};

const tools = [
{ icon: <FaMousePointer />, label: 'Select', type: toolTypes.SELECTION },
{ icon: <FaPencilAlt />, label: 'Pencil', type: toolTypes.PENCIL },
{ icon: <BsSlash />, label: 'Line', type: toolTypes.LINE },
{ icon: <MdTextFields />, label: 'Text', type: toolTypes.TEXT },
{ icon: <BsSquare />, label: 'Rectangle', type: toolTypes.RECTANGLE },
{ icon: <BsCircle />, label: 'Ellipse', type: toolTypes.ELLIPSE },
{ icon: <FaEraser />, label: 'Eraser', type: toolTypes.ERASER },
];

const Toolbar = () => {
  const { history, redoStack } = useSelector((state) => state.whiteboard);

  const dispatch = useDispatch();

  const handleClearCanvas = () => {
    dispatch(pushToHistory()); //going to clear? store this state for undo
    dispatch(setElements([]));   //client side clearing

    emitClearWhiteboard();       //for server side clearing
  };

  const handleUndo = () => {
    dispatch(undo());
    emitFullState(store.getState().whiteboard.elements);
  };
  const handleRedo = () => {
    dispatch(redo());
    emitFullState(store.getState().whiteboard.elements);
  };

return ( 
  <>
<div
   className="fixed top-5 left-1/2 -translate-x-1/2 z-50
              bg-white/80 dark:bg-neutral-900/80 
              border border-gray-300 dark:border-neutral-700
              shadow-lg backdrop-blur-md rounded-full 
              px-4 py-2 flex gap-3 items-center"
 >
  <ColorPickerTool />
  <StrokeWidthTool />
  <FillTool />

{tools.map((tool) => (
  <IconButton 
    key={tool.type}
    icon={tool.icon}
    type={tool.type}
  />
))} 

    {/* UNDO */}
    <button onClick = {handleUndo} title="undo"
      disabled={history.length === 0}
      className={`flex items-center justify-center text-lg p-2 rounded-full transition-all duration-300 ease-in-out
           text-gray-600 dark:text-gray-200
          ${history.length === 0
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-gray-100 dark:hover:bg-neutral-700 hover:scale-105"}
          `}
    >
      <FaUndo />
    </button>
    {/* REDO */}
    <button onClick = {handleRedo} title="redo"
      disabled={redoStack.length === 0}
      className={`flex items-center justify-center text-lg p-2 rounded-full transition-all duration-300 ease-in-out
           text-gray-600 dark:text-gray-200
          ${redoStack.length === 0
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-gray-100 dark:hover:bg-neutral-700 hover:scale-105"}
          `}
    >
      <FaRedo />
    </button>
</div>

<button
        onClick={handleClearCanvas}
        className="
          fixed bottom-5 left-5 z-50
          bg-red-600 hover:bg-red-700
          text-white font-semibold
          p-3 rounded-full shadow-lg
          transition-all duration-300
        "
        title="Clear Canvas"
      >
        <MdDeleteSweep size={22} />
      </button>
</>
);
};

export default Toolbar;

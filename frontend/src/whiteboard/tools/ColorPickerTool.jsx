import { BsPalette } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setStrokeColor} from "../whiteboardSlice";
import { toolTypes } from "../constants";

const ColorPickerTool = () => {
  const dispatch = useDispatch();
  const activeTool = useSelector((state) => state.whiteboard.tool);
  const strokeColor = useSelector((state) => state.whiteboard.strokeColor);

  return (
    <div className="relative" title="color">
      <button
        title="COLOR"
        className={`flex items-center justify-center text-lg p-2 rounded-full
          transition-all duration-300 ease-in-out`}
        style={{
          backgroundColor: strokeColor,
          color: "#fff",
        }}
      >
        <BsPalette />
      </button>

      {/* Native color picker */}
      <input
        type="color"
        value={strokeColor}
        onChange={(e) => dispatch(setStrokeColor(e.target.value))}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default ColorPickerTool;

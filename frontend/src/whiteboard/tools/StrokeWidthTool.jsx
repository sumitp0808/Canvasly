import { useDispatch, useSelector } from "react-redux";
import { setStrokeWidth } from "../whiteboardSlice";
import { FaMinus, FaPlus } from "react-icons/fa";

const StrokeWidthTool = () => {
  const dispatch = useDispatch();
  const strokeWidth = useSelector((state) => state.whiteboard.strokeWidth);
  const strokeColor = useSelector((state) => state.whiteboard.strokeColor);

  return (
    <div className="relative flex items-center gap-2 px-2" title="thickness">
      {/* Preview */}
      <div className="w-10 h-10 flex items-center justify-center
                      bg-gray-100 dark:bg-neutral-100
                      rounded-full">
        <div
          style={{
            height: strokeWidth,
            width: 24,
            backgroundColor: strokeColor,
            borderRadius: 999,
          }}
        />
      </div>

      {/* Slider */}
      <input
        type="range"
        min={1}
        max={20}
        step={1}
        value={strokeWidth}
        onChange={(e) =>
          dispatch(setStrokeWidth(Number(e.target.value)))
        }
        className="w-24 cursor-pointer"
        style={{ accentColor: strokeColor }}
      />
    </div>
  );
};

export default StrokeWidthTool;

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react"; //useRef to implement back drop
import { BsPaintBucket } from "react-icons/bs";
import { setFillStyle, setFillColor } from "../../whiteboardSlice";
import { FILL_STYLES } from "./fillStyles";
import FillPreview from "./fillPreview";

const FillTool = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null); //Create a ref for the menu container

  const fillStyle = useSelector((s) => s.whiteboard.fillStyle);
  const fillColor = useSelector((s) => s.whiteboard.fillColor);

  // effect to handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If menu is open AND the click is NOT inside our menuRef element
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    //Attach the ref to the main wrapper div
    <div className="relative" ref={menuRef}>
      {/* Tool button */}
      <button
        onClick={() => setOpen(!open)}
        title="Fill"
        className='flex items-center justify-center text-lg p-2 rounded-full transition-all duration-300 ease-in-out text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:scale-105'
      >
        <BsPaintBucket />
      </button>

      {/* Popover */}
      {open && (
        <div
          className="absolute top-12 left-0 z-50
                      bg-white dark:bg-[#232329]
                      border rounded-lg shadow-lg
                      p-3 w-64"
        >
          {/* Fill styles grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {FILL_STYLES.map((s) => (
              <FillPreview
                key={s.id}
                style={s.id}
                color={fillColor}
                active={fillStyle === s.id}
                onClick={() => dispatch(setFillStyle(s.id))}
              />
            ))}
          </div>

          {/* Fill color picker */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-white">Fill color</span>
            <input
              type="color"
              value={fillColor}
              onChange={(e) => dispatch(setFillColor(e.target.value))}
              className="w-8 h-8 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FillTool;
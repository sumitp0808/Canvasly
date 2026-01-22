import rough from "roughjs";
import { useRef, useEffect } from "react";

const FillPreview = ({ style, color, active, onClick }) => {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 40, 40);

    if (style !== "none") {
      rc.rectangle(5, 5, 30, 30, {
        fill: color,
        fillStyle: style,
        stroke: "#333",
        strokeWidth: 1,
        roughness: 0,
      });
    } else {
      rc.rectangle(5, 5, 30, 30, {
        stroke: "#333",
        strokeWidth: 1,
        roughness: 0,
      });
    }
  }, [style, color]);

  return (
    <button
      onClick={onClick}
      className={`p-1 rounded border
        ${active ? "border-blue-500" : "border-gray-300"}
      `}
    >
      <canvas ref={ref} width={40} height={40} />
    </button>
  );
};

export default FillPreview;

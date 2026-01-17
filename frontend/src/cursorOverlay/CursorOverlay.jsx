import { useSelector } from "react-redux";

const CursorOverlay = () => {
  const cursors = useSelector((state) => state.cursor.cursors);

  return (
    <>
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          style={{
            position: "absolute",
            left: cursor.x,
            top: cursor.y,
            transform: "translate(-2px, -2px)",
            pointerEvents: "none",
            zIndex: 1000,
            transition: "left 0.08s linear, top 0.08s linear",
          }}
        >
          {/* Cursor arrow */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="blue"
          >
            <path d="M3 2L20 12L13 14L11 21L3 2Z" />
          </svg>

          {/* Name label */}
          <div
            style={{
              marginLeft: 8,
              marginTop: -4,
              padding: "2px 6px",
              background: cursor.color,
              color: "black",
              fontSize: "12px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}
          >
            {cursor.userId}
          </div>
        </div>
      ))}
    </>
  );
};

export default CursorOverlay;

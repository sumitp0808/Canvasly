import { FiMoreHorizontal, FiTrash2, FiEdit2, FiLink } from "react-icons/fi";
import { useState } from "react";
import { getRandomBoardThumbnail } from "../../utils/boardThumbnails";

const BoardCard = ({ board, onOpen, onCopy, onRename, onDelete }) => {
    const thumbnail = getRandomBoardThumbnail(board._id);

    const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={() => onOpen(board._id)}
      className="
        relative
        aspect-[4/3]
        rounded-xl
        bg-white
        border border-gray-200
        hover:shadow-md
        cursor-pointer
        transition
        overflow-hidden
      "
    >
      {/* Thumbnail */}
      <img
        src={thumbnail}
        alt="board thumbnail"
        className="w-full h-3/4 object-cover"
      />
        <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        className="
          absolute top-2 right-2
          p-1.5 rounded-full
          bg-white/90 border border-gray-200
          shadow-sm
          hover:bg-gray-100
          transition
        "
      >
        <FiMoreHorizontal size={16} />
      </button>

      {/* Menu */}
      {menuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2 top-10 w-48
                     bg-white border border-gray-200
                     rounded-lg shadow-lg z-20"
        >
          <button
            onClick={() => {
              onCopy(board._id);
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 text-sm"
          >
            <FiLink /> Copy board link
          </button>

          <button
            onClick={() => {
              onRename(board);
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 text-sm"
          >
            <FiEdit2 /> Rename
          </button>

          <button
            onClick={() => {
              onDelete(board);
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 w-full
                       text-red-600 hover:bg-gray-100 text-sm"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-2 text-sm font-medium truncate">
        {board.title}
      </div>
    </div>
  );
};

export default BoardCard;

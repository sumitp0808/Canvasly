import { FiMoreHorizontal } from "react-icons/fi";
import { getRandomBoardThumbnail } from "../../utils/boardThumbnails";

const BoardCard = ({ board, onOpen }) => {
    const thumbnail = getRandomBoardThumbnail(board._id);

  return (
    <div
      onClick={() => onOpen(board._id)}
      className="
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

      {/* Footer */}
      <div className="px-3 py-2 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-900 truncate">
          {board.title}
        </div>
        <FiMoreHorizontal className="text-gray-400" />
      </div>
    </div>
  );
};

export default BoardCard;

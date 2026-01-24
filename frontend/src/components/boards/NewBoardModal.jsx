import { useState } from "react";
import { FiX } from "react-icons/fi";

const NewBoardModal = ({ open, onClose, onCreate, onJoin }) => {
  const [boardId, setBoardId] = useState("");

  if (!open) return null;

  const handleJoin = () => {
    if (!boardId.trim()) return;
    onJoin(boardId.trim());
    setBoardId("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20"
      />

      {/* Modal */}
      <div
        className="fixed z-50 top-1/2 left-1/2
                   -translate-x-1/2 -translate-y-1/2
                   w-[380px]
                   bg-white rounded-xl shadow-xl
                   p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            New board
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Create */}
        <button
          onClick={onCreate}
          className="w-full mb-4
                     bg-blue-600 hover:bg-blue-700
                     text-white font-medium
                     py-2 rounded-lg
                     transition"
        >
          Create new board
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Join */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            Join with board ID
          </label>
          <input
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            placeholder="Enter board ID"
            className="w-full px-3 py-2
                       border border-gray-300
                       rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleJoin}
            className="w-full
                       bg-gray-900 hover:bg-black
                       text-white font-medium
                       py-2 rounded-lg
                       transition"
          >
            Join board
          </button>
        </div>
      </div>
    </>
  );
};

export default NewBoardModal;

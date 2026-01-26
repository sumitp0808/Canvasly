import { useState } from "react";
import { FiX } from "react-icons/fi";

const RenameBoardModal = ({ open, board, onClose, onSave }) => {
  const [title, setTitle] = useState(board?.title || "");

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      {/* Modal */}
      <div className="fixed z-50 top-1/2 left-1/2
                      -translate-x-1/2 -translate-y-1/2
                      w-[360px]
                      bg-white rounded-xl shadow-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Rename board</h3>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg mb-4"
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2">
            Cancel
          </button>
          <button
            onClick={() => onSave(title)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default RenameBoardModal;

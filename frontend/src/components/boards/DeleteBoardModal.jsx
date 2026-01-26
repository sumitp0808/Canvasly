const DeleteBoardModal = ({ open, board, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40"
      />

      <div className="fixed z-50 top-1/2 left-1/2
                      -translate-x-1/2 -translate-y-1/2
                      w-[360px]
                      bg-white rounded-xl shadow-xl p-5">
        <h3 className="text-lg font-semibold mb-2">
          Delete board?
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteBoardModal;

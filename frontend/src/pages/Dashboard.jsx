import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import BoardCard from "../components/boards/BoardCard";
import NewBoardCard from "../components/boards/NewBoardCard";
import NewBoardModal from "../components/boards/NewBoardModal";
import RenameBoardModal from "../components/boards/RenameBoardModal";
import DeleteBoardModal from "../components/boards/DeleteBoardModal";

import {
  getMyBoards,
  createBoard,
  joinBoard,
  renameBoard as renameBoardApi,
  deleteBoard as deleteBoardApi,
} from "../utils/boardsApi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [boards, setBoards] = useState([]);
  const [showNewBoard, setShowNewBoard] = useState(false);

  // modal states
  const [selectedBoardToRename, setSelectedBoardToRename] = useState(null);
  const [selectedBoardToDelete, setSelectedBoardToDelete] = useState(null);

  // load boards
  useEffect(() => {
    getMyBoards().then(setBoards);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleCreateBoard = async () => {
    const board = await createBoard();
    setShowNewBoard(false);
    navigate(`/room/${board._id}`);
  };

  const handleJoinBoard = async (boardId) => {
    const board = await joinBoard(boardId);
    setShowNewBoard(false);
    navigate(`/room/${board._id}`);
  };

  const handleOpenBoard = (boardId) => {
    navigate(`/room/${boardId}`);
  };

  const handleCopyLink = (boardId) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/room/${boardId}`
    );
  };

  const handleRenameBoardSave = async (boardId, title) => {
    const updated = await renameBoardApi(boardId, title);
    setBoards((prev) =>
      prev.map((b) => (b._id === boardId ? updated : b))
    );
  };

  const handleDeleteBoardConfirm = async (boardId) => {
    await deleteBoardApi(boardId);
    setBoards((prev) => prev.filter((b) => b._id !== boardId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
              {user?.name?.[0]}
            </div>
          )}
          <div>
            <div className="text-sm text-gray-500">Welcome back</div>
            <div className="text-lg font-semibold text-gray-900">
              {user?.name}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          <FiLogOut size={20} />
        </button>
      </header>

      {/* Main */}
      <main className="px-8 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your boards</h2>
          <p className="text-gray-600 text-sm mt-1">
            Create a new board or continue working on an existing one.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <NewBoardCard onClick={() => setShowNewBoard(true)} />

          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onOpen={handleOpenBoard}
              onCopy={handleCopyLink}
              onRename={() => setSelectedBoardToRename(board)}
              onDelete={() => setSelectedBoardToDelete(board)}
            />
          ))}
        </div>
      </main>

      {/* Modals */}
      <NewBoardModal
        open={showNewBoard}
        onClose={() => setShowNewBoard(false)}
        onCreate={handleCreateBoard}
        onJoin={handleJoinBoard}
      />

      <RenameBoardModal
        open={!!selectedBoardToRename}
        board={selectedBoardToRename}
        onClose={() => setSelectedBoardToRename(null)}
        onSave={(title) => {
          handleRenameBoardSave(selectedBoardToRename._id, title);
          setSelectedBoardToRename(null);
        }}
      />

      <DeleteBoardModal
        open={!!selectedBoardToDelete}
        board={selectedBoardToDelete}
        onClose={() => setSelectedBoardToDelete(null)}
        onConfirm={() => {
          handleDeleteBoardConfirm(selectedBoardToDelete._id);
          setSelectedBoardToDelete(null);
        }}
      />
    </div>
  );
};

export default Dashboard;

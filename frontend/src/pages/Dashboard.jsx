import { useDispatch, useSelector } from "react-redux";
import {useEffect, useState} from 'react';
import { logout } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import BoardsGrid from "../components/boards/BoardsGrid";
import { getMyBoards, createBoard, joinBoard } from "../utils/boardsApi";


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [boards, setBoards] = useState([]);

  useEffect(() => {
    getMyBoards().then(setBoards);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleCreateBoard = async () => {
    const board = await createBoard();
    navigate(`/room/${board._id}`);
  };

  const handleOpenBoard = (id) => {
    navigate(`/room/${id}`);
  };

  const handleJoinBoard = async () => {
    const boardId = prompt("Enter board ID");
    if(!boardId) return;
    
    const board = await joinBoard(boardId);
    navigate(`/room/${board._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header
        className="flex items-center justify-between
                   px-8 py-4
                   bg-white border-b border-gray-200"
      >
        {/* Left: user info */}
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
              {user?.name?.[0]}
            </div>
          )}

          <div className="leading-tight">
            <div className="text-sm text-gray-500">Welcome back</div>
            <div className="text-lg font-semibold text-gray-900">
              {user?.name}
            </div>
          </div>
        </div>

        {/* logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 rounded-full
                     text-gray-500 hover:text-gray-900
                     hover:bg-gray-100
                     transition"
        >
          <FiLogOut size={20} />
        </button>
      </header>

      {/* Main content */}
      <main className="px-8 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Your boards
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Create a new board or continue working on an existing one.
          </p>
        </div>

        {/* Boards placeholder */}
        <BoardsGrid
          boards={boards}
          onCreateBoard={handleCreateBoard}
          onOpenBoard={handleOpenBoard}
        />
      </main>
    </div>
  );
};

export default Dashboard;

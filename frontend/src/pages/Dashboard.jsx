import { useDispatch, useSelector } from "react-redux";
import { logout } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4
                         bg-white dark:bg-neutral-800
                         border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Welcome,
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {user?.name}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg
                     bg-red-600 hover:bg-red-700
                     text-white font-medium
                     transition"
        >
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Your Boards
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Create a new board or open an existing one.
        </p>

        {/* Placeholder area (boards will come here next) */}
        <div className="border-2 border-dashed border-gray-300 dark:border-neutral-700
                        rounded-xl p-10 text-center
                        text-gray-500 dark:text-gray-400">
          Boards will appear here.
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

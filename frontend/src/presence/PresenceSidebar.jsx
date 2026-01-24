import { useSelector } from "react-redux";
import { useState } from "react";
import { FiUsers } from "react-icons/fi";

const PresenceSidebar = () => {
  const users = useSelector((state) => state.presence.users);
  const me = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top-right toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="
    fixed top-4 right-4 z-50
    bg-white text-gray-900
    dark:bg-neutral-800 dark:text-gray-100
    border border-gray-300 dark:border-neutral-700
    p-2 rounded-full shadow-lg
    hover:scale-105 transition
  "
        title="Users"
      >
        <FiUsers size={22} />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Sliding drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64
    bg-white text-gray-900
    dark:bg-neutral-900 dark:text-gray-100
    shadow-xl z-50 p-4
    transform transition-transform duration-300 ease-in-out
    ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiUsers />
          Users
        </h3>

        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.userId}
              className={`flex items-center gap-2 p-2 rounded
                text-gray-900 dark:text-gray-100
                ${u.userId === me._id
                  ? "bg-blue-100 dark:bg-blue-900/40"
                  : "bg-gray-100 dark:bg-neutral-800"}
              `}
            >
              {/* Avatar */}
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">
                {u.name}
                {u.userId === me._id && " (You)"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PresenceSidebar;

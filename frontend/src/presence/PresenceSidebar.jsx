import { useSelector } from "react-redux";
import { useState } from "react";

const PresenceSidebar = () => {
  const users = useSelector((state) => state.presence.users);
  const me = useSelector((state) => state.user);
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded-lg shadow"
      >
        {open ? "Hide Users" : "Show Users"}
      </button>

      {/* Sidebar */}
      {open && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-40 p-4">
          <h3 className="text-lg font-bold mb-4">Users</h3>

          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.userId}
                className={`flex items-center gap-2 p-2 rounded
                  ${u.userId === me.userId ? "bg-blue-100" : "bg-gray-100"}
                `}
              >
                <span className="text-xl">{u.avatar}</span>
                <span className="font-medium">
                  {u.name}
                  {u.userId === me.userId && " (You)"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default PresenceSidebar;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/userSlice";
import { v4 as uuid } from "uuid";

const avatars = ["🐱", "🐶", "🐼", "🦊", "🐸"];

const Lobby = () => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [roomInput, setRoomInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = uuid().slice(0, 6);
    join(roomId);
  };

  const join = (roomId) => {
    if (!name) return alert("Enter name");
    if(!roomId) return alert("Valid roomId is required to join");

    dispatch(setUser({ name, avatar, roomId }));
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4 ">Collaborate Now</h2>

        <input
          placeholder="Your name"
          className="w-full border p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex gap-2 mb-3">
          {avatars.map(a => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`text-2xl ${a === avatar ? "scale-125" : ""}`}
            >
              {a}
            </button>
          ))}
        </div>

        <button
          onClick={createRoom}
          className="w-full bg-blue-600 text-white p-2 rounded mb-2"
        >
          Create Room
        </button>

        <input
          placeholder="Room ID"
          className="w-full border p-2 mb-2"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />

        <button
          onClick={() => join(roomInput)}
          className="w-full bg-gray-800 text-white p-2 rounded"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Lobby;

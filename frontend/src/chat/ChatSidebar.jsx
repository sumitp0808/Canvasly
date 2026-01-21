import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { emitChatMessage } from "../socketConn/socketConn";
import ChatMessage from "./ChatMessage";
import DateSeparator from "./DateSeparator";
import { isSameDay } from "./chatUtils";
import { FiMessageSquare } from "react-icons/fi";

const ChatDrawer = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const messages = useSelector((state) => state.chat.messages);
  const me = useSelector((state) => state.user);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;

    emitChatMessage({
      roomId: me.roomId,
      message: text,
      user: { name: me.name, avatar: me.avatar },
    });

    setText("");
  };

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-14 z-50
          bg-white text-gray-900
          dark:bg-neutral-800 dark:text-gray-100
          border p-2 rounded-full shadow"
      >
        <FiMessageSquare size={20} />
      </button>
    {/* Backdrop */}
  <div
  onClick={() => setOpen(false)}
  className={`fixed inset-0 z-40 bg-black/20 transition-opacity
    ${open
      ? "opacity-100 pointer-events-auto"
      : "opacity-0 pointer-events-none"}
  `}
  />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80
          bg-white dark:bg-neutral-900
          text-gray-900 dark:text-gray-100
          shadow-xl z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="p-3 font-semibold border-b shrink-0">Group Chat</div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((msg, i) => {
            const prev = messages[i - 1];
            const showDate =
              !prev || !isSameDay(prev.timestamp, msg.timestamp);

            const isMe = msg.user.name === me.name;
            const showAvatar =
              !isMe &&
              (!prev || prev.user.name !== msg.user.name);

            return (
              <div key={msg.id}>
                {showDate && (
                  <DateSeparator timestamp={msg.timestamp} />
                )}
                <ChatMessage
                  msg={msg}
                  isMe={isMe}
                  showAvatar={showAvatar}
                />
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input (fixed at bottom) */}
        <div className="p-2 border-t shrink-0">
  <div
    className="
      flex items-center gap-2
      bg-gray-100 dark:bg-neutral-800
      rounded-full px-3 py-2
    "
  >
    {/* Text input */}
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && send()}
      placeholder="Type a message"
      className="
        flex-1 bg-transparent outline-none
        text-gray-900 dark:text-gray-100
        placeholder-gray-500
      "
    />

    {/* Send button */}
    <button
      onClick={send}
      className="
        w-9 h-9 flex items-center justify-center
        rounded-full
        bg-green-600 hover:bg-green-700
        text-white
        transition
      "
      title="Send"
    >
      {/* Send icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </button>
  </div>
</div>

      </div>
    </>
  );
};

export default ChatDrawer;

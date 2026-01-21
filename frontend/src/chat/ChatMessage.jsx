import { formatTime } from "./chatUtils";

const ChatMessage = ({ msg, isMe, showAvatar }) => {
  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}
    >
      {!isMe && showAvatar && (
        <div className="mr-2 text-xl">{msg.user.avatar}</div>
      )}

      <div
        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm
          ${isMe
            ? "bg-[#144D37] text-white rounded-br-none"
            : "bg-[#242626] text-white rounded-bl-none"}
        `}
      >
        {!isMe && showAvatar && (
          <div className="text-xs font-semibold mb-1">
            {msg.user.name}
          </div>
        )}

        <div>{msg.message}</div>

        <div
          className={`text-[10px] mt-1 text-right
            ${isMe ? "text-green-100" : "text-[#A3A4A4]"}
          `}
        >
          {formatTime(msg.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

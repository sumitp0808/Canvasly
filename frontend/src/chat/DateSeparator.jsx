import { formatDate } from "./chatUtils";

const DateSeparator = ({ timestamp }) => (
  <div className="flex justify-center my-3">
    <span className="text-xs px-3 py-1 rounded-full
      bg-gray-300 text-gray-800">
      {formatDate(timestamp)}
    </span>
  </div>
);

export default DateSeparator;

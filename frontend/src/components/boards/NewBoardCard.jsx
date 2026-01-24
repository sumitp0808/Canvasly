import { FiPlus } from "react-icons/fi";

const NewBoardCard = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        aspect-[4/3]
        rounded-xl
        bg-blue-600 hover:bg-blue-700
        text-white
        flex flex-col items-center justify-center
        transition
      "
    >
      <FiPlus size={28} />
      <span className="mt-2 text-sm font-medium">
        New board
      </span>
    </button>
  );
};

export default NewBoardCard;

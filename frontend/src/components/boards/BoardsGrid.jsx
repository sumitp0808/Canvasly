import BoardCard from "./BoardCard";
import NewBoardCard from "./NewBoardCard";

const BoardsGrid = ({ boards, onCreateBoard, onOpenBoard }) => {
  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-6
      "
    >
      <NewBoardCard onCreate={onCreateBoard} />

      {boards.map((board) => (
        <BoardCard
          key={board._id}
          board={board}
          onOpen={onOpenBoard}
        />
      ))}
    </div>
  );
};

export default BoardsGrid;

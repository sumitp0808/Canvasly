const Board = require("../models/board.model");

/* Create board */
exports.createBoard = async (req, res) => {
  const userId = req.user._id;

  const board = await Board.create({
    members: [userId],
  });

  res.status(201).json(board);
};

/* Join board */
exports.joinBoard = async (req, res) => {
  const { boardId } = req.body;
  const userId = req.user._id;

  const board = await Board.findById(boardId);
  if (!board) return res.status(404).json({ error: "Board not found" });

  if (!board.members.includes(userId)) {
    board.members.push(userId);
    await board.save();
  }

  res.json(board);
};

/* List boards for dashboard */
exports.getMyBoards = async (req, res) => {
  const userId = req.user._id;

  const boards = await Board.find({
    members: userId,
  }).sort({ updatedAt: -1 });

  res.json(boards);
};

/* Get single board (load canvas) */
exports.getBoardById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const board = await Board.findById(id);
  if (!board) return res.status(404).json({ error: "Board not found" });

  if (!board.members.includes(userId))
    return res.status(403).json({ error: "Access denied" });

  res.json(board);
};

/* Save elements */
exports.saveBoardElements = async (req, res) => {
  const { id } = req.params;
  const { elements } = req.body;
  const userId = req.user._id;

  const board = await Board.findById(id);
  if (!board) return res.status(404).json({ error: "Board not found" });

  if (!board.members.includes(userId))
    return res.status(403).json({ error: "Access denied" });

  board.elements = elements;
  await board.save();

  res.json({ success: true });
};


//mutation controllers
exports.renameBoard = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user._id;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const board = await Board.findById(id);
  if (!board) return res.status(404).json({ error: "Board not found" });

  if (!board.members.includes(userId)) {
    return res.status(403).json({ error: "Access denied" });
  }

  board.title = title.trim();
  await board.save();

  res.json(board);
};

exports.deleteBoard = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const board = await Board.findById(id);
  if (!board) return res.status(404).json({ error: "Board not found" });

  if (!board.members.includes(userId)) {
    return res.status(403).json({ error: "Access denied" });
  }

  await board.deleteOne();
  res.json({ success: true });
};

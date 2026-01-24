import api from "./api";

export const getMyBoards = () =>
  api.get("/boards").then((res) => res.data);

export const createBoard = () =>
  api.post("/boards").then((res) => res.data);

export const joinBoard = (boardId) =>
  api.post("/boards/join", { boardId }).then((res) => res.data);

export const getBoardById = (boardId) =>
  api.get(`/boards/${boardId}`).then((res) => res.data);

export const saveBoardElements = (boardId, elements) =>
  api.put(`/boards/${boardId}/elements`, { elements });

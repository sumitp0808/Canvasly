import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetPresence } from "../presence/presenceSlice";
import {resetCursors} from "../cursorOverlay/cursorSlice";
import { setElements } from "../whiteboard/whiteboardSlice";
import { getBoardById } from "../utils/boardsApi";
import Whiteboard from "../whiteboard/Whiteboard";
import CursorOverlay from "../cursorOverlay/CursorOverlay";
import { connectWithSocketServer, disconnectSocket} from "../socketConn/socketConn";
import PresenceSidebar from "../presence/PresenceSidebar";
import ChatSidebar from "../chat/chatSidebar";

const Room = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(resetPresence());
    dispatch(resetCursors());

    getBoardById(roomId).then((board) => {
      dispatch(setElements(board.elements || []));
      connectWithSocketServer(roomId);
    })

    return () => {
      disconnectSocket();
    };
  }, [roomId]);

  return (
    <>
      <Whiteboard roomId = {roomId} />
      <CursorOverlay />
      <PresenceSidebar />
      <ChatSidebar roomId = {roomId} />
    </>
  );
};

export default Room;

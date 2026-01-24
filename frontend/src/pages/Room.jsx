import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setElements } from "../whiteboard/whiteboardSlice";
import { getBoardById } from "../utils/boardsApi";
import Whiteboard from "../whiteboard/Whiteboard";
import CursorOverlay from "../cursorOverlay/CursorOverlay";
import { connectWithSocketServer, joinRoom } from "../socketConn/socketConn";
import PresenceSidebar from "../presence/PresenceSidebar";
import ChatSidebar from "../chat/chatSidebar";

const Room = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    getBoardById(roomId).then((board) => {
      if(!mounted) return;

      dispatch(setElements(board.elements || []));
      connectWithSocketServer(roomId);
    })

    // joinRoom({roomId});
    return () => {
      mounted = false;
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

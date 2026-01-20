import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Whiteboard from "../whiteboard/Whiteboard";
import CursorOverlay from "../cursorOverlay/CursorOverlay";
import { connectWithSocketServer, joinRoom } from "../socketConn/socketConn";
import PresenceSidebar from "../presence/PresenceSidebar";

const Room = () => {
  const { roomId } = useParams();
  // const user = useSelector((state) => state.user);

  useEffect(() => {
    connectWithSocketServer();
    joinRoom({roomId});
  }, []);

  return (
    <>
      <Whiteboard />
      <CursorOverlay />
      <PresenceSidebar />
    </>
  );
};

export default Room;

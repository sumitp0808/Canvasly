import CursorOverlay from "./cursorOverlay/CursorOverlay";
import { connectWithSocketServer } from "./socketConn/socketConn";
import Whiteboard from "./whiteboard/Whiteboard"
import { useEffect } from "react";


function App() {
  useEffect(() => {
    connectWithSocketServer();
  }, []);

  return (
    <>
      <Whiteboard />
      <CursorOverlay />
    </>
  )
}

export default App

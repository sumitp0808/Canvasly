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
    </>
  )
}

export default App

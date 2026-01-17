import {io} from "socket.io-client";
import { store } from "../store/store";
import { setElements, updateElement } from "../whiteboard/whiteboardSlice";
import { updateCursorPosition } from "../cursorOverlay/cursorSlice";

let socket;

export const connectWithSocketServer = () => {
    socket = io("http://localhost:3000");

    //listens from server
    socket.on("connect", () => {
        console.log("connected to socketio server");
    });

    socket.on('whiteboard-state', elements => {
        store.dispatch(setElements(elements));
    });

    socket.on('element-update', (elementData) => {
        store.dispatch(updateElement(elementData));
    });

    socket.on('whiteboard-clear', () => {
        store.dispatch(setElements([]));
    });

    socket.on('cursor-position', (cursorData) => {
        store.dispatch(updateCursorPosition(cursorData));
    });
};

//emits to server
export const emitElementUpdate = (elementData) => {
    socket.emit("element-update", elementData);
};

export const emitClearWhiteboard = () => {
    socket.emit("whiteboard-clear");
};

export const emitCursorPosition = (cursorData) => {
    socket.emit('cursor-position', cursorData);
}
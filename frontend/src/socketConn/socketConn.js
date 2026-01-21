import {io} from "socket.io-client";
import { store } from "../store/store";
import { setElements, updateElement } from "../whiteboard/whiteboardSlice";
import { updateCursorPosition, removeCursorPosition } from "../cursorOverlay/cursorSlice";
import { userJoined, userLeft } from "../presence/presenceSlice";
import {setUserId} from '../store/userSlice';
import { addMessage } from "../chat/chatSlice";

let socket;
export const connectWithSocketServer = () => {
    socket = io("http://localhost:3000");

    //listens from server
    socket.on("connect", () => {
        console.log("connected to socketio server");
        store.dispatch(setUserId(socket.id));
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
    
    socket.on('user-joined', (user) => {
        store.dispatch(userJoined(user));
    });

    socket.on("room-users", (users) => {
        users.forEach(user => {
        store.dispatch(userJoined(user));
        });
    });

    socket.on('user-disconnected', (disconnectedUserId) => {
        store.dispatch(removeCursorPosition(disconnectedUserId));
        store.dispatch(userLeft(disconnectedUserId));
    });

    //chat
    socket.on("chat-message", (msg) => {
        //msg - > {id, message, user, timestamp}
        store.dispatch(addMessage(msg));
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

export const joinRoom = ({roomId}) => {
    const state = store.getState();
    const user = state.user;
    socket.emit('join-room', {roomId, user});
};

export const emitChatMessage = (data) => {
    //data -> {roomId, message, user}
    socket.emit("chat-message", data);
};

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

const server = http.createServer(app);

app.use(cors());

let elements = [];
const roomUsers = {};  // roomId -> [{ userId, name, avatar }]

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    },
});


io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('join-room', ({roomId, user}) => {
        socket.join(roomId);
        socket.roomId = roomId;
        socket.user = user;
        
        const newUser = {
            userId: socket.id,
            name: user.name,
            avatar: user.avatar,
        };
        
        if(!roomUsers[roomId]){
            roomUsers[roomId] = [];
        }

        //Send existing users to the new user
        socket.emit("room-users", roomUsers[roomId]);

        //Add new user to room
        roomUsers[roomId].push(newUser);

        io.to(roomId).emit('user-joined', newUser);

        io.to(roomId).emit('whiteboard-state', elements);
    });

    //emit listeners
    socket.on('element-update', (elementData) => {
        updateElementInElements(elementData);

        socket.to(socket.roomId).emit('element-update', elementData);
    });

    socket.on('whiteboard-clear', () => {
        elements = [];

        socket.to(socket.roomId).emit('whiteboard-clear');
    });

    socket.on('cursor-position', (cursorData) => {
        socket.to(socket.roomId).emit('cursor-position', {
            ...cursorData,
            userId: socket.id,
        });
    });

    socket.on('disconnect', () => {
        const roomId = socket.roomId;
        if(!roomId || !roomUsers[roomId]) return;

        roomUsers[roomId] = roomUsers[roomId].filter(
            u => u.userId !== socket.id
        );

        socket.to(roomId).emit('user-disconnected', socket.id);

        //cleanup
        if (roomUsers[roomId].length === 0) {
            delete roomUsers[roomId];
        }
    });
});

app.get('/', (req, res) => {
    res.send("hello sever io");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("server is running on port", PORT);
});

const updateElementInElements = (elementData) => {
    const index = elements.findIndex(el => el.id === elementData.id)

    if(index === -1) return elements.push(elementData)

    elements[index]  = elementData;
}
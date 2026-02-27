const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
require('dotenv').config();
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.routes');
const {Server} = require("socket.io");

const server = http.createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

/* --- ROUTES ---*/
app.use(express.json());
app.use('/auth', authRouter);
app.use('/boards', require('./routes/board.routes'));


/* --- MONGO DB CONNECT --- */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.log('❌ MongoDB Connection Error:', err));


/* --- LIVE PARTS --- */
const roomElements = {}; // roomId -> elements
const roomUsers = {};  // roomId -> [{ userId, name, avatar }]

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
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
            userId: user.userId,
            name: user.name,
            avatar: user.avatar,
        };
        
        //initializations
        if(!roomUsers[roomId]){
            roomUsers[roomId] = [];
        }
        if (!roomElements[roomId]) {
            roomElements[roomId] = [];
        }

        //Send existing users to the new user
        socket.emit("room-users", roomUsers[roomId]);

        //Add new user to room
        roomUsers[roomId].push(newUser);

        io.to(roomId).emit('user-joined', newUser);

        io.to(roomId).emit('whiteboard-state', roomElements[roomId]);
    });

    //emit listeners
    socket.on('element-update', (elementData) => {
        updateElementInElements(elementData, socket.roomId);

        socket.to(socket.roomId).emit('element-update', elementData);
    });

    socket.on('whiteboard-state', (elements) => {
        roomElements[socket.roomId] = elements;

        socket.to(socket.roomId).emit('whiteboard-state', elements);
    });

    socket.on('whiteboard-clear', () => {
        roomElements[socket.roomId] = [];

        socket.to(socket.roomId).emit('whiteboard-clear');
    });

    socket.on('cursor-position', (cursorData) => {
        socket.to(socket.roomId).emit('cursor-position', cursorData);
    });

    socket.on('disconnect', () => {
        const roomId = socket.roomId;
        if(!roomId || !roomUsers[roomId] || !socket.user) return;

        roomUsers[roomId] = roomUsers[roomId].filter(
            u => u.userId !== socket.user.userId
        );

        socket.to(roomId).emit('user-disconnected', socket.user.userId);
        socket.leave(roomId);
        //cleanup
        if (roomUsers[roomId].length === 0) {
            delete roomUsers[roomId];
        }
    });

    //chat feature
    socket.on("chat-message", ({ roomId, message, user }) => {
        io.to(roomId).emit("chat-message", {
            id: Date.now(),
            message,
            user,
            timestamp: Date.now(),
        });
    });


});

app.get('/', (req, res) => {
    res.send("hello sever io");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("server is running on port", PORT);
});

const updateElementInElements = (elementData, roomId) => {
    const index = roomElements[roomId].findIndex(el => el.id === elementData.id)

    if(index === -1) return roomElements[roomId].push(elementData)

    roomElements[roomId][index]  = elementData;
}
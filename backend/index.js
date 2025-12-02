const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

const server = http.createServer(app);

app.use(cors());

let elements = [];

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    },
});


io.on('connection', (socket) => {
    console.log('user connected', socket.id);
    io.to(socket.id).emit('whiteboard-state', elements);

    //emit listeners
    socket.on('element-update', (elementData) => {
        updateElementInElements(elementData);

        socket.broadcast.emit('element-update', elementData);
    });

    socket.on('whiteboard-clear', () => {
        elements = [];

        socket.broadcast.emit('whiteboard-clear');
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
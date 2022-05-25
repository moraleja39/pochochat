const { Server } = require("socket.io");
const log = require("./log");
const io = new Server({
    cors: {
        origin: "*"
    }
});

module.exports = io

const io = require('socket.io')({
    transports: [
        'websocket'
    ],
});

module.exports = io;

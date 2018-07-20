const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// const bodyParser = require('body-parser');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined!'));

    socket.on('createMessage', function(msg, callback){
        console.log('Message created', msg);
        // io.emit('newMessage', {
        //     from: msg.from,
        //     text: msg.text,
        //     createdAt: new Date().getTime()
        // });
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        callback('This is from server');
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});
// app.use(bodyParser.json());


server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = {app};
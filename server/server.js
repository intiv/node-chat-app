const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// const bodyParser = require('body-parser');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit('newEmail', {
    //     from: 'inti@yahoo.com',
    //     text: 'Wazzuuuuu',
    //     to: 'ricardo@gmail.com'
    // });

    // socket.on('createEmail', (email) => {
    //     console.log('Email created', email);
    // });


    socket.on('createMessage', function(msg){
        console.log('Message created', msg);
        io.emit('newMessage', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime()
        });
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
let socket = io();
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});


socket.on('newMessage', function(msg) {
    console.log('New message', msg);
});


// socket.on('newEmail', function(email) {
//     console.log('New Email', email);
// });

// socket.emit('createEmail', {
//     to: 'inti@yahoo.com',
//     text: 'holis'
// });
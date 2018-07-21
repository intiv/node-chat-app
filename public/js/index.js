let socket = io();
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});


socket.on('newMessage', function(msg) {
    let formattedTime = moment(msg.createdAt).format('h:mm a'); 
    let li = jQuery('<li></li>');
    li.text(`${msg.from} ${formattedTime}: ${msg.text}`)
    jQuery('#messages').append(li);
});


socket.on('newLocationMessage', function (msg) {
    let formattedTime = moment(msg.createdAt).format('h:mm a');
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${msg.from} ${formattedTime}: `);
    a.attr('href', msg.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    let msgTextBox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: msgTextBox.val()
    }, function() {
        msgTextBox.val('');
    });
});

let locationButton = jQuery('#send-location');
locationButton.on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.removeAttr('disabled').text('Send location');
    }, function(){
        alert('Unable to fetch location');
        locationButton.removeAttr('disabled').text('Send location');
    });
});
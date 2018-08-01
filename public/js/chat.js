let socket = io();

function scrollToBottom() {
    //Selectors
    let messages = jQuery('#messages');
    let newMsg = messages.children('li:last-child');
    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMsgHeight = newMsg.innerHeight();
    let lastMsgHeight = newMsg.prev().innerHeight();

    if(clientHeight + scrollTop + newMsgHeight + lastMsgHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    let params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err){
        if(err){
            window.location.href = '/';
            alert(err);
        }else{
            console.log('No error');
        }
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users){
    let ol = jQuery('<ol></ol>');
    users.forEach((user) => {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});

socket.on('newMessage', function(msg) {
    let formattedTime = moment(msg.createdAt).format('h:mm a'); 
    // let li = jQuery('<li></li>');
    // li.text(`${msg.from} ${formattedTime}: ${msg.text}`)
    // jQuery('#messages').append(li);

    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});


socket.on('newLocationMessage', function (msg) {
    let formattedTime = moment(msg.createdAt).format('h:mm a');
    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        url: msg.url,
        from: msg.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    // let li = jQuery('<li></li>');
    // let a = jQuery('<a target="_blank">My current location</a>');
    // li.text(`${msg.from} ${formattedTime}: `);
    // a.attr('href', msg.url);
    // li.append(a);
    // jQuery('#messages').append(li);
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
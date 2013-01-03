    //socket connection
//var socket = io.connect('http://localhost'),
var socket = io.connect('//newboon.eu01.aws.af.cm/'),
    //DOM elements
    counter = document.getElementById('counter'),
    input = document.getElementById('input'),
    btn = document.getElementById('submit'),
    log = document.getElementById('log'),
    inputName = document.getElementById('input-name');
    sendMessage = function(event) {
      socket.emit('outcomingMessage', { 'user' : inputName.value, 'message' : input.value })
    }
// user events
btn.addEventListener('click', sendMessage);

//socket events
socket.on('youAreConnected', function(data) {
  counter.innerHTML = data.dudes;
});
socket.on('incomingMessage', function(data) {
  var html = log.innerHTML;
  log.innerHTML = '<p><span class="name">' + data.user + ' : </span>' + data.message + '</p>' + html;
});

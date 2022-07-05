/**
 * Example UDP Server
 * UDP datagram server listening on 6000
 */

// Dependencies
var dgram = require('dgram');

// Creating a server
var server = dgram.createSocket('udp4');

server.on('message', function (messageBuffer, sender) {
    // Do something with message or sender identified
    var messageString = messageBuffer.toString();
    console.log(messageString);
});

// bind the server
server.bind(6000);
/**
 * Example TCP (Net) Client
 * Connects to port 6000 and send the word *ping* to the server
 */

// Dependencies
var net = require('net');

// Message
var outboundMessage = 'ping';

// Client
var client = net.createConnection({ port: 6000 }, function () {
    client.write(outboundMessage);
})

// When the server writes back, log it out and kill the connection
client.on('data', function (inboundMessage) {
    var messageString = inboundMessage.toString();
    console.log(messageString);
    client.end();
})
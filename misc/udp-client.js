/**
 * Example udp client
 * sending a message to udp server on 6000
 */

// Dependencies
var dgram = require('dgram');

// client
var client = dgram.createSocket('udp4');

// define the message and pull it into a buffer
var messageString = 'this is a message';
var messageBuffer = Buffer.from(messageString);

// send off a message
client.send(messageBuffer, 6000, 'localhost', function (err) {
    client.close();
});
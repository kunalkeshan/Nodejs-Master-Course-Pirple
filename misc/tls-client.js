/**
 * Example TLS Client
 * Connects to port 6000 and send the word *ping* to the server
 */

// Dependencies
var tls = require('tls');
var fs = require('fs');
var path = require('path');

// Client options
var options = {
    'ca': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')), // only required when using self signed certificate
};

// Message
var outboundMessage = 'ping';

// Client
var client = tls.connect(6000, options, function () {
    client.write(outboundMessage);
})

// When the server writes back, log it out and kill the connection
client.on('data', function (inboundMessage) {
    var messageString = inboundMessage.toString();
    console.log(messageString);
    client.end();
})
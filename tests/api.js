/**
 * Api tests
 */

// Dependencies
var app = require('../index');
var assert = require('assert');
var http = require('http');
var config = require('../lib/config');

// Holder for the tests
var api = {};

// Helpers
var helpers = {};
helpers.makeGetRequests = function (path, callback) {
    // Config
    var requestDetails = {
        'protocol': 'http:',
        'hostname': 'localhost',
        'port': config.httpPort,
        method: 'GET',
        path: path,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    // send req
    const req = http.request(requestDetails, function (res) {
        callback(res);
    });
    req.end();
};

// The main init() function should be able to run without error
api['api.init should start without throwing'] = function (done) {
    assert.doesNotThrow(function () {
        app.init(function (err) {
            done();
        });
    }, TypeError)
}

// Make a req to ping
api['/ping should respond to GET with 200'] = function (done) {
    helpers.makeGetRequests('/ping', function (res) {
        assert.equal(res.statusCode, 200);
        done();
    });
};

// Make a request to /api/users
api['/api/users should respond to GET with 400'] = function (done) {
    helpers.makeGetRequests('/api/users', function (res) {
        assert.equal(res.statusCode, 400);
        done();
    });
};

// Make a request to random path
api['random path should respond to GET with 404'] = function (done) {
    helpers.makeGetRequests('/this/is/a/random/path', function (res) {
        assert.equal(res.statusCode, 404);
        done();
    });
};

// Export api tests
module.exports = api;
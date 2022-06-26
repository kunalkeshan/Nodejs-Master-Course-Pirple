/**
 * Unit Tests 
 */

// Dependencies
var helpers = require('../lib/helpers');
var assert = require('assert');
var logs = require('../lib/logs');

// Holder for tests
var unit = {};

// Assert that the getNumber function returns a number
unit['helpers.getNumber should return a number'] = function (done) {
    var value = helpers.getNumber();
    assert.equal(typeof value, 'number');
    done();
};


// Assert that the getNumber function returns 1
unit['helpers.getNumber should return 1'] = function (done) {
    var value = helpers.getNumber();
    assert.equal(value, 1);
    done();
};

// Assert that the getNumber function returns 2
unit['helpers.getNumber should return 2'] = function (done) {
    var value = helpers.getNumber();
    assert.equal(value, 2);
    done();
};

// Logs.list should callback an array and an false error
unit['logs.list should callback a false array and an array of log names'] = function (done) {
    logs.list(true, function (err, logFileNames) {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
};

// logs.truncate should not throw if the log id doesn't exist
unit['logs.truncate should not throw if the logId does not exist. It should callback an error instead'] = function (done) {
    assert.doesNotThrow(function () {
        logs.truncate('I do not exists', function (err) {
            assert.ok(err);
        });
    }, TypeError)
};

// Export unit tests
module.exports = unit;

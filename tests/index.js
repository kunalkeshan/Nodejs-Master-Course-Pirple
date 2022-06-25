/**
 * Test runner
 */

// Dependencies
var helpers = require('../lib/helpers');
var assert = require('assert');

// Application logic for the test runner
_app = {};

// Container for test
_app.tests = {
    unit: {},
};

// Assert that the getNumber function returns a number
_app.tests.unit['helpers.getNumber should return a number'] = function (done) {
    var value = helpers.getNumber();
    assert.equal(typeof value, 'number');
    done();
};


// Assert that the getNumber function returns 1
_app.tests.unit['helpers.getNumber should return 1'] = function (done) {
    var value = helpers.getNumber();
    assert.equal(value, 1);
    done();
};

// Assert that the getNumber function returns 2
_app.tests.unit['helpers.getNumber should return 2'] = function (done) {
    var value = helpers.getNumber();
    assert.equal(value, 2);
    done();
};

// Count all the tests
_app.countTests = function () {
    var counter = 0;
    for (var key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            var subTests = _app.tests[key];
            for (var testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    counter++;
                }
            }
        }
    }
    return counter;
}

// Produce test outcome report
_app.produceTestReport = function (limit, successes, errors) {
    console.log("");
    console.log("-----BEGIN TEST REPORT-----");
    console.log("");
    console.log('Total Tests: ', limit);
    console.log("Pass: ", successes);
    console.log("Fail: ", errors.length);

    // If errors the console them;
    if (errors.length > 0) {
        console.log("-----BEGIN ERROR DETAILS-----")
        errors.forEach(function (testError) {
            console.log(`\x1b[31m%s\x1b[0m`, testError.name);
            console.log(testError.error);
            console.log("")
        })
    }

    console.log("")
    console.log("-----END TEST REPORT-----")
}

// To run all the tests, collecting the error and successes
_app.runTests = function () {
    var errors = [];
    var successes = 0;
    var limit = _app.countTests();
    var counter = 0;
    for (var key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            var subTests = _app.tests[key];
            for (var testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    (function() {
                        var tempTestName = testName;
                        var testValue = subTests[testName];
                        try {
                            testValue(function () {
                                // if calls back, then error succeeded, log in green
                                console.log(`\x1b[32m%s\x1b[0m`, tempTestName);
                                count++;
                                successes++;
                                if (counter === limit) {
                                    _app.produceTestReport(limit, successes, error);
                                }
                            })
                        } catch (error) {
                            // If error, then test failed, log in red
                            errors.push({
                                name: testName,
                                error,
                            });
                            console.log(`\x1b[31m%s\x1b[0m`, tempTestName);
                            counter++;
                            if (counter === limit) {
                                _app.produceTestReport(limit, successes, errors);
                            }
                        }
                    })();
                }
            }
        }
    }
}

// Run the tests
_app.runTests();

/**
 * Test runner
 */

// Override the node_env to testing
process.env.NODE_ENV = 'testing';

// Application logic for the test runner
_app = {};

// Container for test
_app.tests = {};

// Unit test dependency
_app.tests.unit = require('./unit');

// Api test dependency
_app.tests.api = require('./api');

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
    process.exit(0);
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
                    (function () {
                        var tempTestName = testName;
                        var testValue = subTests[testName];
                        try {
                            testValue(function () {
                                // if calls back, then error succeeded, log in green
                                console.log(`\x1b[32m%s\x1b[0m`, tempTestName);
                                counter++;
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

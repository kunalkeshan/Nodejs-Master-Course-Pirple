/**
 * Async Hooks example
 */

// Dependencies
var async_hooks = require('async_hooks');
var fs = require('fs');

// Target execution context
var targetExecutionContext = false;

// Arbitrary async function
var whatTimeIsIt = function (callback) {
    setInterval(function () {
        fs.writeSync(1, `When the setInterval runs, the execution context is: ${async_hooks.executionAsyncId()}\n`)
        callback(Date.now());
    }, 1000);
}

// Call that function
whatTimeIsIt(function (time) {
    fs.writeSync(1, `The time is ${time}\n`);
});

// Hooks
var hooks = {
    init(asyncId, type, triggerAsyncId, resource) {
        fs.writeSync(1, `Hooks init ${asyncId}\n`);
    },
    before(asyncId) {
        fs.writeSync(1, `Hooks before ${asyncId}\n`);
    },
    after(asyncId) {
        fs.writeSync(1, `Hooks after ${asyncId}\n`);
    },
    destroy(asyncId) {
        fs.writeSync(1, `Hooks destroy ${asyncId}\n`);
    },
    promiseResolve(asyncId) {
        fs.writeSync(1, `Hooks promiseResolve ${asyncId}\n`);
    }
}

// Create an instance of asynchooks instance
var asyncHooks = async_hooks.createHook(hooks);
asyncHooks.enable();
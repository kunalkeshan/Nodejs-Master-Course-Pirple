/**
 * Example REPL Server
 * Takes the word *fizz* and log out *buzz*
 */

// Dependencies
var repl = require('repl');

// Start the repl
repl.start({
    prompt: '$',
    eval: function (str) {
        // Evaluation function
        console.log('At the eval stage: ', str);

        // Is str is fizz, say buzz
        if (str.indexOf('fizz') > -1) {
            console.log('buzz')
        };
    },
});

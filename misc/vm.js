/**
 * Running some arbitrary commands
 */

// Dependencies
var vm = require('vm');

// Define context for the script to run in
var content = {
    foo: 25,
};

// Define the script that should execute
var script = new vm.Script(`
    foo = foo * 2
    var bar = foo + 1;
    var fizz = 52;
`);

// Run the script 
script.runInNewContext(content);
console.log(content);



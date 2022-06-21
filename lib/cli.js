/**
 * CLI Related Tasks
 */

// Dependencies
var readline = require('readline');
var util = require('util');
var os = require('os');
var v8 = require('v8');
var debug = util.debuglog('cli');
var events = require('events');
var _data = require('./data');
class _events extends events { };
var e = new _events;

// Instantiate the CLI module object
var cli = {};

// Input Handlers
e.on('man', function (str) {
    cli.responders.help();
});

e.on('help', function (str) {
    cli.responders.help();
});

e.on('exit', function (str) {
    cli.responders.exit();
});

e.on('stats', function (str) {
    cli.responders.stats();
});

e.on('list users', function (str) {
    cli.responders.listUsers();
});

e.on('more user info', function (str) {
    cli.responders.moreUserInfo(str);
});

e.on('list checks', function (str) {
    cli.responders.listChecks(str);
});

e.on('more check info', function (str) {
    cli.responders.moreCheckInfo(str);
});

e.on('list logs', function (str) {
    cli.responders.listLogs();
});

e.on('more log info', function (str) {
    cli.responders.moreLogInfo(str);
});

e.on('cls', function () {
    cli.responders.cls();
});

e.on('rs', function () {
    cli.responders.rs();
});

// Responders object
cli.responders = {}

// Help / Man
cli.responders.help = function () {
    var commands = {
        'man': 'Show this help page',
        'help': 'Alias of man command',
        'exit': 'Kill the CLI and the rest of the application',
        'stats': 'Get statistics of underlying operating system and resource utilization',
        'list users': 'Show a list of all registered users in the system',
        'more user info --{userId}': 'Show details of a specific user',
        'list checks --up --down': 'Show a list of all active checks in the system',
        'more check info --{checkId}': 'Show details of a specified check',
        'list logs': 'Show a list of all log files available to be read',
        'more log info --{fileName}': 'Show details of a specified log file',
        'cls': 'Clear the console'
    };

    // Show a header for the help page that is as wide as the screen
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Show each command, followed by it's explanation in white and yellow
    for (var key in commands) {
        if (commands.hasOwnProperty(key)) {
            var value = commands[key];
            var line = '\x1b[33m' + key + '\x1b[0m';
            var padding = 60 - line.length;
            for (i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }

    cli.verticalSpace(2);
    cli.horizontalLine();
};

// Exit
cli.responders.exit = function () {
    console.log('Exiting CLI...');
    process.exit(0);
};

// Stats
cli.responders.stats = function () {
    // Compile an object of stats
    var stats = {
        'Load Average': os.loadavg().join(' '),
        'CPU Count': os.cpus().length,
        'Free Memory': os.freemem(),
        'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
        'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'Uptime': os.uptime() + ' Seconds',
    }

    // Show a header for the help page that is as wide as the screen
    cli.horizontalLine();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);

    // Log out stats
    for (var key in stats) {
        if (stats.hasOwnProperty(key)) {
            var value = stats[key];
            var line = '\x1b[33m' + key + '\x1b[0m';
            var padding = 60 - line.length;
            for (i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }

    cli.verticalSpace(2);
    cli.horizontalLine();
};

// List Users
cli.responders.listUsers = function () {
    _data.list('users', function (err, userIds) {
        if (!err && userIds && userIds.length > 0) {
            cli.verticalSpace();
            userIds.forEach(function (userId) {
                _data.read('users', userId, function (err, userData) {
                    if (!err && userData) {
                        var line = `Name: ${userData.firstName} ${userData.lastName}, Phone: ${userData.phone}, No of Checks: `;
                        var numberOfChecks = typeof userData.checks === 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
                        line += numberOfChecks;
                        console.log(line);
                        cli.verticalSpace();
                    }
                })
            })
        }
    })
};

// More user info
cli.responders.moreUserInfo = function (str) {
    // Get the id from the string
    var arr = str.split('--');
    var userId = typeof arr[1] === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (userId) {
        // Look the user up
        _data.read('users', userId, function (err, userData) {
            if (!err && userData) {
                // Remove the hashed password
                delete userData.hashedPassword;
                // Print JSON with text highlighted
                cli.verticalSpace();
                console.dir(userData, { 'colors': true });
                cli.verticalSpace();
            }
        })
    }
};

// List Checks
cli.responders.listChecks = function (str) {
    console.log('You asked for list checks', str);
};

// More Check info
cli.responders.moreCheckInfo = function (str) {
    console.log('You asked for more check info', str);
};

// List Logs
cli.responders.listLogs = function () {
    console.log('You asked to list logs');
};

// More Log info
cli.responders.moreLogInfo = function (str) {
    console.log('You asked for more log info', str);
};

// Clear console
cli.responders.cls = function () {
    console.clear();
}

// Restart server
cli.responders.rs = function () {

}

// Formatting Methods

// Create a vertical space
cli.verticalSpace = function (lines) {
    lines = typeof lines === 'number' && lines > 0
        ? lines : 1;
    for (i = 0; i < lines; i++) {
        console.log('');
    }

}

// Create a horizontal line
cli.horizontalLine = function () {
    // Get the available width of the screen
    var width = process.stdout.columns;
    var line = '';
    for (i = 0; i < width; i++) {
        line += '_';
    }
    console.log(line);
}

// Create centered text on the screen
cli.centered = function (str) {
    str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : '';

    // Get the available width of the screen
    var width = process.stdout.columns;

    // Calc the left padding
    var leftPadding = Math.floor((width - str.length) / 2);

    // put in left padded space
    var line = '';
    for (i = 0; i < leftPadding; i++) {
        line += ' ';
    }
    line += str;
    console.log(line);
}



// Input processor
cli.processInput = function (str) {
    str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : false;
    if (str) {
        // Codify the unique strings that identify the unique questions allowed to be asked
        var uniqueInputs = ['man', 'help', 'exit', 'stats', 'list users', 'more user info', 'list checks', 'more check info', 'list logs', 'more log info', 'cls', 'rs'];

        // Go through inputs
        var matchFound = false;
        var counter = 0;
        uniqueInputs.some(function (input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit an event matching the unique input
                e.emit(input, str);
                return true;
            }
        });

        // If no match is found, tell user to try again
        if (!matchFound) {
            console.log("Sorry, try again")
        }
    }
}

// Init Script
cli.init = function () {
    // Send the start message to the console
    console.log('\x1b[36m%s\x1b[0m', 'The CLI is running')

    // Start the interface
    var _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '$ '
    });

    // Create an initial prompt
    _interface.prompt();

    _interface.on('line', function (str) {
        // Send to the input processor
        cli.processInput(str);

        // Re-initialize the prompt
        _interface.prompt();

        // If the user stops the CLI, kill the associated process
        _interface.on('close', function () {
            process.exit(0);
        })
    })
}

// Exporting module
module.exports = cli;

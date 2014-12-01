var http = require('http'),
    url = require('url');

/**
 * Executes an array of Command objects
 * Passes the response from each command into the next command
 * Needs to make async requests and have the callback access the original Parser instance
 * to continue the execution of the script.
 *
 * Use a module not a class to do this.
 */

function Exe(parser) {
    this.parser = parser;
};

/**
 * Start running the commands from the script
 */
Exe.prototype.run = function() {
    this.input = '';

    // get first command
    var command = this.parser.next();
    
    if (command) {
    // fire off async request
        this.makeRequest(command);
    } else {
        this.end();
    }
};

var runNext = function() {
    // send this.input to next command
    //
};

var update = function(response) {
    console.log('Status: '+ response.statusCode);
    console.log('Headers: '+ JSON.stringify(response.headers));

    // capture response headers too 
    response.on('data', function(chunk) { 
        this.input += chunk;
        console.log('data');
    });

    response.on('end', function() {
        // run next command
        runNext();
        console.log('end');
    });
};

Exe.prototype.update = update;

Exe.prototype.makeRequest = function(command) {
    // split options.endpoint into host and path
    var u = url.parse(command.endpoint);
    // create options object
    var options = {host: u.hostname, port: u.port, path: u.path, method: command.method};
    var req = http.request(options, update);
    console.log(req);
    req.end();
};

Exe.prototype.runNext = runNext;

Exe.prototype.end = function() {

};

module.exports = Exe;

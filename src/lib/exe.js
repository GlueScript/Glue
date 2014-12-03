var request = require('request');

/**
 * Executes an array of Command objects
 * Passes the response from each command into the next command
 *
 * @todo update command objects to add body and request headers for use later 
 * rather than pass around multiple connected function params
 */

/**
 * parser provides commands in order
 * callback used when the commands have completed
*/
function Exe(parser, callback) {
    this.parser = parser;
    this.callback = callback;
};

/**
 * Start running the commands from the script
 */
Exe.prototype.start = function() {
    this.runNext({}, '');
};

Exe.prototype.runNext = function(headers, body) {
    var exe = this;
    var command = this.parser.next();

    if (command) {
        console.log('runNext(): making request to : ' + command.uri);
        command['headers'] = headers;
        command['body'] = body;
        // fire off async request
        request(command, function(error, response, body) {
            if (!error && response.statusCode == 200){
                console.log('Success');
                // push the response headers and body into the next command before requesting it?
                exe.runNext({'content-type' : response.headers['content-type']}, body);
            } else {
                // end the script here and respond
                exe.end('Failure: ' + error);
            }
        });
    } else {
        this.end(body);
    }
};

Exe.prototype.end = function(result) {
    console.log('End');
    // return the result as a string
    this.callback && this.callback(result);
};

module.exports = Exe;

var request = require('request');

/**
 * Executes an array of Command objects
 * Passes the response from each command into the next command
 */

/**
 * parser provides commands in order to be executed
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
    console.log('Start');
    this.runNext({}, '');
};

/**
 * Actually we just want the content-type / mime-type of the body string
 * not all the previous response headers. Maybe use a composite type of string and mime-type
 */
Exe.prototype.runNext = function(headers, body) {
    var exe = this;
    var command = this.parser.next();

    if (command) {
        console.log('runNext(): making request to : ' + command.uri + ' : ' + JSON.stringify(headers));
        command['headers'] = headers;
        // if command['split'] then split body assuming a json array and make a request per item
        command['body'] = body;
        // fire off async request
        request(command, function(error, response, body) {
            if (!error && response.statusCode == 200){
                console.log('Success');
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

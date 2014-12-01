var request = require('request'),
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
    //this.input = '';
    this.runNext({}, '');
};

Exe.prototype.runNext = function(headers, body) {
    console.log('runNext');
    // send this.input to next command
    // get first command
    var command = this.parser.next();
    
    if (command) {
        // fire off async request
        this.makeRequest(command, headers, body);
    } else {
        this.end(body);
    }
};

Exe.prototype.makeRequest = function(command, hdrs, body) {
    var exe = this;
    console.log('Making request to : ' + command.endpoint);
    
    var headers = {};
    headers['content-type'] = hdrs['content-type'] || '';
   
    // use command.method and body when making requests
    var options = {
        method: command.method,
        uri: command.endpoint,
        body: body,
        headers: headers
     };

    //console.log(options);
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200){
            console.log('Success');
            //console.log(response.headers);
            // push the response headers and body into the next command before requesting it?
            exe.runNext(response.headers, body);
        } else {
            // end the script here and respond
            exe.end('Failure: ' + error);
        }

    });
};

Exe.prototype.end = function(result) {
    console.log('End');
    console.log(result);
};

module.exports = Exe;

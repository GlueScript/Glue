var request = require('request'),
    url = require('url');

/**
 * Executes an array of Command objects
 * Passes the response from each command into the next command
 */

/**
 * pass a callback function to use when the script is ended
 * rather than a response object
*/
function Exe(parser, response) {
    this.parser = parser;
    this.response = response;
};

/**
 * Start running the commands from the script
 * pass a callback function to run() to use when the script is ended
 * rather than to the constructor?
 */
Exe.prototype.run = function() {
    this.runNext({}, '');
};

Exe.prototype.runNext = function(headers, body) {
    console.log('runNext');
    // get next command
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
    console.log('Making request to : ' + command.uri);
    
    var headers = {};
    headers['content-type'] = hdrs['content-type'] || '';
   
    // use command.method and body when making requests
    var options = {
        method: command.method,
        uri: command.uri,
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
    this.response && this.response.json(
        {result: result}
    );
};

module.exports = Exe;

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
    this.body_count = 0;
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
    var command = this.parser.next();

    if (command) {
        if (command['split']){
            // split body, expect json array
            var json_body = JSON.parse(body);
            if ((json_body instanceof Array)){
                this.runNext(headers, json_body);
            } else {
                this.runNext(headers, body);
            }
        } else {
            this.multiRequest(command, headers, body);
        }
    } else {
        this.end(body);
    }
};

Exe.prototype.multiRequest = function(command, headers, body) {
    var exe = this;
    // body might be a string or an array
    var bodies = body;
    if (!(body instanceof Array)){
        var bodies = [body];
    }

    exe.body_count = bodies.length;

    //console.log(bodies);
    console.log('runNext(): making request to : ' + command.uri + ' : ' + JSON.stringify(headers) + ' ' + exe.body_count);

    // generate a request per body item
    for(var key in bodies) { 
        command['headers'] = headers;
        command['body'] = bodies[key];
        request(command, function(error, response, response_body) {
            if (!error && response.statusCode == 200){
                console.log('Success');
                // call receiveResponse 
                exe.runNext({'content-type' : response.headers['content-type']}, response_body);
            } else {
                // end the script here and respond
                exe.end('Failure: ' + error);
            }
        });
    }
};

/*
 * Callback from each request
*/
Exe.prototype.receiveResponse = function(error, response, body) {
    this.incoming_bodies.push({headers: headers, body: body});
    // if incoming_bodies equals body_count then call runNext
}

Exe.prototype.end = function(result) {
    console.log('End');
    // return the result as a string
    this.callback && this.callback(result);
};

module.exports = Exe;

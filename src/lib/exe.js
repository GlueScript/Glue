var request = require('request'),
    Payload = require('./payload')
    PayloadBag = require('./payload_bag'),
    _ = require('underscore'),
    logger = require('./logger');

/**
 * Executes an array of Command objects
 * Passes the response from each command into the next command
 *
 * parser provides commands in order to be executed
 * callback used when the execution of the commands is completed
*/
function Exe(parser) {
    this.parser = parser;
};

/**
 * Start running the commands from the script
 */
Exe.prototype.start = function(callback) {
    this.callback = callback;
    logger.log('info', 'Start');
    this.start = new Date().getTime();
    this.next(new Payload(''));
};

/**
 * We just want the content-type / mime-type of the body string
 * not all the previous response headers. 
 */
Exe.prototype.next = function(payload) {

    var next = this.parser.next();

    if (next) {
        if (next.payload) {
            this.next(next.payload);
        } else if (next.operator == 'split') {
            // split body, expect json array
            // caution - payload might be an array if split appears twice in the script...
            this.next(payload.split());
        } else {
            payload = _.isArray(payload) ? payload : [payload];

            this.incoming = new PayloadBag(payload.length * next.commands.length);
            // generate a request per item in payload for each command
            // ought to clone these objects ?
            // use async here
            for (var p in payload) {
                for (var c in next.commands) {
                    this.request(next.commands[c], payload[p]);
                }
            }
        }
    } else {
        this.end(null, payload);
    }
};

Exe.prototype.request = function(command, payload) {
    var exe = this;
    command['body'] = payload.content;
    command['headers'] = {'content-type': payload.type};
    logger.log('info', 'request : ' + command.method + ' ' + command.uri + ' : ' + payload.type + ' ' + exe.incoming.total());

    request(command, function(error, response, response_body) {
        // receive success and failure the same so that we complete all pending requests
        if (!error && response.statusCode == 200) {
            logger.log('info', 'Success: ' + command.uri + " " + response.headers['content-type']);
            exe.receive(null, new Payload(response_body, response.headers['content-type']));
        } else {
            logger.log('error', 'Error: ' + command.uri);
            exe.receive(error || 'Error ' + response.statusCode, new Payload(response_body));
        }
    });
};

/*
 * Callback from each request - pass this to the request() method directly
*/
Exe.prototype.receive = function(error, payload) {
    this.incoming.push(error, payload);
    if (this.incoming.full()) {
        if (!this.incoming.errors()) { 
            this.next(this.incoming.join());
        } else {
            // send a Payload to end() function
            this.end('Error', this.incoming.join());
        }
    }
}

Exe.prototype.end = function(error, result) {
    var end = new Date().getTime();
    logger.log('info', 'End ');
    logger.log('info', 'Execution took: ' + (end - this.start) + ' ms');
    // return the result as a string
    this.callback(error, result);
};

module.exports = Exe;

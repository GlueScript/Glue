var request = require('request'),
    Payload = require('./payload')
    PayloadBag = require('./payload_bag'),
    _ = require('underscore'),
    logger = require('./logger'),
    async = require('async');

/**
 * Executes an array of Command objects gotten in order from Parser
 * Passes the response from each command into the next command
*/
function Exe(parser) {
    this.parser = parser;
};

/**
 * Start running the commands from the script
 */
Exe.prototype.start = function(callback) {
    logger.log('info', 'Start');
    this.callback = callback;
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
            var that = this;
            var incoming = new PayloadBag(payload.length * next.commands.length);

            // generate a request per item in payload for each command
            async.each(makeRequests(next.commands, payload), function(command, cb){
                logger.log('info', command);
                request(command, function(error, response, response_body) {
                    if (!error && response.statusCode == 200) {
                        logger.log('info', 'Success: ' + command.uri + " " + response.headers['content-type']);
                        incoming.push(null, new Payload(response_body, response.headers['content-type']));
                    } else {
                        logger.log('error', 'Error: ' + command.uri);
                        incoming.push(error || 'Error ' + response.statusCode, new Payload(response_body));
                    }
                    // don't call callback with an error, deal with any response errors when all have completed
                    cb();
                });
            }, function(err) {
                // continue to next command
                if (!incoming.errors()) { 
                    that.next(incoming.join());
                } else {
                    // stop script execution
                    that.end('Error', incoming.join());
                }
            });
        }
    } else {
        this.end(null, payload);
    }
};

Exe.prototype.end = function(error, result) {
    logger.log('info', 'End. Execution took: ' + (new Date().getTime() - this.start) + ' ms');
    this.callback(error, result);
};

/**
 * Return an array of objects combining the commands properties and the payloads properties
 */
function makeRequests(commands, payloads) {
    var cmds = [];
    _.each(payloads, function(payload) {
        _.each(commands, function(command) {
            var cmd = _.clone(command);
            // if cmd.method == 'GET' then don't set a request body
            cmd.body = payload.content;
            cmd.headers = {'content-type': payload.type};
            cmds.push(cmd); 
        });
    });
    return cmds;
}

module.exports = Exe;

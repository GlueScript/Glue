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
    var that = this;
    if (next) {
        if (next.payload) {
            this.next(next.payload);
        } else if (next.operator == 'split') {
            // split body, expect json array
            // caution - payload might be an array if split appears twice in the script...
            this.next(payload.split());
        } else {
            fire(next, payload, function(err, result) {
                if (err) {
                    that.end(err, result);
                } else {
                    that.next(result);
               }
            });
        }
    } else {
        // no more commands to process
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
            cmd.body = cmd.method != 'GET' ? payload.content : '';
            cmd.headers = {'content-type': payload.type};
            cmds.push(cmd); 
        });
    });
    return cmds;
}

/**
 * fire off 1+ requests, when they have all completed combine the responses and execute callback
 */
function fire(cmd, payload, callback) {
    payload = _.isArray(payload) ? payload : [payload];
    var incoming = new PayloadBag();

    // generate a request per item in payload for each command
    async.each(makeRequests(cmd.commands, payload), function(command, cb){
        logger.log('info', command.method + ' ' + command.uri);
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
        if (!incoming.errors()) { 
            callback(null, incoming.join());
        } else {
            callback('Error', incoming.join());
        }
    });
}

module.exports = Exe;

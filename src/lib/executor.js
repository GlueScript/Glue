var request = require('request'),
    Payload = require('./payload'),
    PayloadBag = require('./payload_bag'),
    _ = require('underscore'),
    async = require('async');

/**
 * Executes an array of Command objects gotten in order from Parser
 * Passes the response from each command into the next command
*/
function Executor(script, logger) {
    this.script = script;
    Executor.prototype.logger = logger;
};

/**
 * Start running the commands from the script
 */
Executor.prototype.start = function(callback) {
    this.logger.log('info', 'Start');
    this.callback = callback;
    this.start = new Date().getTime();
    this.next(new Payload(''));
};

/**
 * We just want the content-type / mime-type of the body string
 * not all the previous response headers. 
 */
Executor.prototype.next = function(payload) {
    var next = this.script.next();
    var that = this;
    if (next) {
        if (next.payload) {
            this.next(next.payload);
        } else if (next.operator == 'split') {
            // split body, expect json array
            // caution - payload might be an array if split appears twice in the script...
            this.next(payload.split());
        } else {
            payload = _.isArray(payload) ? payload : [payload];
            fire(makeRequests(next.commands, payload), function(err, result) {
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

Executor.prototype.end = function(error, result) {
    this.logger.log('info', 'End. Execution took: ' + (new Date().getTime() - this.start) + ' ms');
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
function fire(commands, callback) {
    var incoming = new PayloadBag();

    // generate a request per item in payload for each command
    async.each(commands, function(command, cb){
        Executor.prototype.logger.log('info', command.method + ' ' + command.uri);
        request(command, function(error, response, response_body) {
            if (!error && response.statusCode == 200) {
                Executor.prototype.logger.log('info', 'Success: ' + command.uri + " " + response.headers['content-type']);
                incoming.push(null, new Payload(response_body, response.headers['content-type']));
            } else {
                Executor.prototype.logger.log('error', 'Error: ' + command.uri);
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

module.exports = Executor;

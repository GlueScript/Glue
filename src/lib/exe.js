var request = require('request'),
    Payload = require('./payload');

/**
 * Executes an array of Command objects
 * Passes the response from each command into the next command
 *
 * parser provides commands in order to be executed
 * callback used when the execution of the commands is completed
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
    this.runNext(new Payload(''));
};

/**
 * We just want the content-type / mime-type of the body string
 * not all the previous response headers. 
 */
Exe.prototype.runNext = function(payload) {

    this.incoming = [];
    var command = this.parser.next();

    if (command) {
        if (command.operator == 'split'){
            // split body, expect json array
            // caution - payload might be an array if split appears twice in the script...
            this.runNext(payload.split());
        } else {
            if (payload instanceof Array){
                this.request_count = payload.length;
                // generate a request per item
                for(var key in payload) {
                    this.request(command, payload[key]);
                }
            } else {
                this.request_count = 1;
                this.request(command, payload);
            }
        }
    } else {
        this.end(join(payload));
    }
};

Exe.prototype.request = function(command, payload) {
    var exe = this;
    command['body'] = payload.content;
    command['headers'] = {'content-type': payload.type};

    console.log('request() : ' + command.uri + ' : ' + payload.type + ' ' + exe.request_count);
    request(command, function(error, response, response_body) {
        if (!error && response.statusCode == 200){
            console.log('Success');
            // call receiveResponse 
            exe.receiveResponse(new Payload(response_body));
        } else {
            // end the script here and respond
            exe.end('Failure: ' + error);
        }
    });
};

/*
 * Callback from each request
*/
Exe.prototype.receiveResponse = function(payload) {
    this.incoming.push(payload);
    // if incoming equals request_count then call runNext
    if (this.incoming.length == this.request_count){
        this.request_count = 0;
        if (this.incoming.length > 1) {
            // join incoming and run next command
            this.runNext(join(this.incoming));
        } else {
            this.runNext(this.incoming[0]);
        }
    }
}

Exe.prototype.end = function(result) {
    console.log('End');
    // return the result as a string
    this.callback(result);
};

/**
 * Should / can this be on Payload class?
 */
function join(payload) {
    // deal with Arrays of Payload instances
    if (payload instanceof Array){
        var all = [];
        for(var item in payload){
            // if item is a JSON string then convert to an Array or Object here
            // so that when we stringify Payload it can be deserialized by the next service
            // console.log('payload[item].content : ' + payload[item].content);
            all.push(payload[item].content);
        }
        return new Payload(all);
    } else {
        return payload;
    }
}

module.exports = Exe;

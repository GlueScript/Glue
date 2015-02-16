var Payload = require('./payload'),
    _ = require('underscore');

/**
 * Container for incoming response Payloads
 */
function PayloadBag() {
    // declare private vars
    var contents = [];

    this.push = function(e, p) {
        contents.push({error: e, payload: p});
    };

    this.errors = function() {
        return _.some(contents, function(content) { 
            return content.error; 
        });
    };

    /**
    * If there is 2 or more responses return a Payload containing an array of the responses
    * but join responses that are arrays into a single array
    * If there is 1 response return that Payload
    * If there are 0 responses return a Payload with empty contents
    */
    this.join = function() {
        if (contents.length == 0) {
            return new Payload('');
        } else if (contents.length == 1) {
            return contents[0].payload;
        } else {
            var all = [], value;
            for (var i in contents) {
                value = contents[i].payload.value;
                if (_.isArray(value)) {
                    all = all.concat(value);
                } else {
                    all.push(contents[i].payload.content);
                }
            }
            return new Payload(all);
        }
    };
}

module.exports = PayloadBag;

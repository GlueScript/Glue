var Payload = require('./payload'),
    _ = require('underscore');

/**
 * Container for incoming response Payloads
 */
function PayloadBag(size) {
    // declare private vars
    var size = size;
    var contents = [];
    var that = this;

    this.total = function() {
        return size;
    };

    this.currentSize = function() {
        return contents.length;
    };

    this.full = function() {
        return contents.length == size;
    };

    this.push = function(e, p) {
        contents.push(
            {
                error: e,
                payload: p
            }
        );
    };

    this.errors = function() {
        for (var res in contents) {
            if (contents[res].error) {
                return true;
            }
        }
        return false;
    };

    /**
    * If there is 2 or more responses return a Payload containing an array of the responses
    * but join responses that are arrays into a single array
    * If there is 1 response return that Payload
    * If there are 0 responses return a Payload with empty contents
    */
    PayloadBag.prototype.join = function() {
        if (that.currentSize() == 0) {
            return new Payload('');
        } else if (that.currentSize() == 1) {
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

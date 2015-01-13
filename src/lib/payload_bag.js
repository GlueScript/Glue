var Payload = require('./payload'),
    _ = require('underscore');

/**
 * Container for incoming responses 
 */
function PayloadBag(size) {
    this.size = size;
    this.contents = [];
}

PayloadBag.prototype.total = function() {
    return this.size;
};

PayloadBag.prototype.currentSize = function() {
    return this.contents.length;
};

PayloadBag.prototype.full = function() {
    return this.contents.length == this.size;
};

PayloadBag.prototype.push = function(e, p) {
    this.contents.push(
        {
            error: e,
            payload: p
        }
    );
};

PayloadBag.prototype.errors = function() {
    for (var res in this.contents) {
        if (this.contents[res].error) {
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
    if (this.contents.length == 0) {
        return new Payload('');
    } else if (this.contents.length == 1) {
        return this.contents[0].payload;
    } else {
        var all = [], value;
        for (var i in this.contents) {
            value = this.contents[i].payload.value;
            if (_.isArray(value)) {
                all = all.concat(value);
            } else {
                all.push(this.contents[i].payload.content);
            }
        }
        return new Payload(all);
    }
};

module.exports = PayloadBag;

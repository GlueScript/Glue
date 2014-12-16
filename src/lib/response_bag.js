var Payload = require('./payload');

/**
 * Container for incoming responses 
 */
function ResponseBag(size) {
    this.size = size;
    this.contents = [];
}

ResponseBag.prototype.total = function() {
    return this.size;
};

ResponseBag.prototype.currentSize = function() {
    return this.contents.length;
};

ResponseBag.prototype.full = function() {
    return this.contents.length == this.size;
};

ResponseBag.prototype.push = function(e, p) {
    this.contents.push(
        {
            error: e,
            payload: p
        }
    );
};

ResponseBag.prototype.errors = function() {
    for (var res in this.contents){
        if (this.contents[res].error){
            return true;
        }
    }
    return false;
};

/**
 * If there is 2 or more responses return a Payload containing an array of the responses
 * If there is 1 response return that Payload
 * If there are 0 responses return a Payload with empty contents
 */
ResponseBag.prototype.join = function() {
    if (this.contents.length == 0) {
        return new Payload('');
    } else if (this.contents.length == 1){
        return this.contents[0].payload;
    } else {
        var all = [];
        for (var i in this.contents){
            all.push(this.contents[i].payload.content);
        }
        return new Payload(all);
    }
};

module.exports = ResponseBag;

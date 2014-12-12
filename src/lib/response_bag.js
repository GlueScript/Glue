/**
 * Container for incoming responses 
 */
function ResponseBag(size) {
    this.size = size;
    this.responses = [];
}

ResponseBag.prototype.totalSize = function() {
    return this.size;
};

ResponseBag.prototype.currentSize = function() {
    return this.responses.length;
};

ResponseBag.prototype.complete = function() {
    return this.responses.length == this.size;
};

ResponseBag.prototype.push = function(e, p) {
    this.responses.push(
        {
            error: e,
            payload: p
        }
    );
};

module.exports = ResponseBag;

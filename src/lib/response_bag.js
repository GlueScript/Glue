/**
 * Container for incoming responses 
 */
function ResponseBag(size) {
    this.size = size;
    this.contents = [];
}

ResponseBag.prototype.totalSize = function() {
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
    for(var res in this.contents){
        if (this.contents[res].error){
            return true;
        }
    }
    return false;
};

ResponseBag.prototype.responses = function() {
    return [];
};

module.exports = ResponseBag;

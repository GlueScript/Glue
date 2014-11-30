/**
 * Take a stream of tokens and create an array of commands from a glue script
 * Command is an object with a method and an endpoint
 */

var Parser = (function() {
    
    var init = function(script) {
        // initialise a tokenizer
    };

    var next = function() {
        return {method: 'GET', endpoint: 'uri'};
    };

    return {
        init: init,
        next: next
    };
})();

module.exports = Parser;

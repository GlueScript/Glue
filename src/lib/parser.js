var tokenizer = require('./tokenizer');

/**
 * Take a stream of tokens and create an array of commands from a glue script
 * Command is an object with a method and an endpoint
 */

var Parser = (function() {
    
    var init = function(string) {
        // initialise a tokenizer
        tokenizer.init(string);
    };

    var next = function() {
        if (tokenizer.hasMore()){
            var token = tokenizer.next();
            // if this is an operator then get next token
            if (isOperator(token)){
                if (tokenizer.hasMore()){
                    return {method: extractMethod(token), endpoint: tokenizer.next()};
                }
            } else {
                // else method = GET
                return {method: 'GET', endpoint: token};
            }
        }
    };
    
    /**
     * @todo use a Token class with these methods
     */
    var isOperator = function(token) {
        return (token[0] == '>');
    };
    
    var extractMethod = function(token) {
        if ('>>' == token){
            return 'POST';
        }
    };

    return {
        init: init,
        next: next
    };
})();

module.exports = Parser;

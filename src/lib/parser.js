var Tokenizer = require('./tokenizer');

/**
 * Take a stream of tokens and create an array of commands from a glue script
 * Command is an object with a method and an endpoint
 */
var Parser = (function() {
    
    var tokenizer;

    var init = function(string) {
        // initialise a tokenizer
        tokenizer = new Tokenizer(string);
    };

    var next = function() {
        if (tokenizer.hasMore()){
            var token = tokenizer.next();
            // if this is an operator then get next token
            if (token.isOperator()){
                if (tokenizer.hasMore()){
                    /**
                     * @todo handle scripts where two operators appear adjacent
                     */
                    return {method: token.getMethod(), endpoint: tokenizer.next().getValue()};
                }
            } else {
                // else method = GET
                return {method: 'GET', endpoint: token.getValue()};
            }
        }
    };
    
    return {
        init: init,
        next: next
    };
})();

module.exports = Parser;

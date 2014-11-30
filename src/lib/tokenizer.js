var Token = require('./token.js');

/*
 * Tokenize a glue script into its elements
 */
var Tokenizer = (function() {
    
    var tokens = [];

    var index = 0;

    /*
     * Initialise tokenisation
     */
    var init = function(string) {
        tokens = string.match(/\S+/g) || [];
        index = 0;
    };
    
    /*
     * Return the next token if available
     */
    var next = function() {
        if (hasMore()){
            return new Token(tokens[index++]);
        }
    };

    /**
     * test if there are any more tokens
     */
    var hasMore = function() {
        return (index < tokens.length);
    };

    return {
        init: init,
        next: next,
        hasMore: hasMore
    };

})();

module.exports = Tokenizer;

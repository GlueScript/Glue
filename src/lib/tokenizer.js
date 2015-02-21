var Token = require('./token.js');

/*
 * Tokenize a Glue script into its elements
 * split on whitespace and carriage returns
 */
function Tokenizer(string) {
    var tokens = string.match(/\S+/g) || [];
    var index = 0;
    var that = this;

    /**
    * test if there are any more tokens
    */
    this.hasMore = function() {
        return (index < tokens.length);
    }

    this.next = function() {
        if (that.hasMore()) {
         return new Token(tokens[index++]);
        } 
    }

    /**
    * return the next token but do not move the cursor forwards
    */
    this.peek = function() {
        if (that.hasMore()) {
            return new Token(tokens[index]);
        } 
    }

    this.index = function() {
        return index;
    }
}

module.exports = Tokenizer;

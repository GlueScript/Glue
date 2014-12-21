var Token = require('./token.js');

/*
 * Tokenize a Glue script into its elements
 * split on whitespace and carriage returns
 */
function Tokenizer(string) {
    this.tokens = string.match(/\S+/g) || [];
    this.index = 0;
}

/**
* test if there are any more tokens
*/
Tokenizer.prototype.hasMore = function() {
    return (this.index < this.tokens.length);
};

Tokenizer.prototype.next = function() {
    if (this.hasMore()) {
         return new Token(this.tokens[this.index++]);
    } 
};

module.exports = Tokenizer;

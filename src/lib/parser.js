var Tokenizer = require('./tokenizer');

/**
 * Parser implements generating a set of commands from a script
 * It validates the script syntax is correct
 */
function Parser(string) {
    this.tokenizer = new Tokenizer(string);
};

/**
 * Return a command object with a method and uri property
 * Throw exception if script is invalid
 * Should be 'operator uri' or just '/'
 */
Parser.prototype.next = function() {
    if (this.tokenizer.hasMore()){
        var token = this.tokenizer.next();
        // enforce method followed by uri
        if (token.isMethod()){
            if (this.tokenizer.hasMore()){
                var next = this.tokenizer.next();
                if (next.isUri()) {
                    return {method: token.getValue(), uri: next.getValue()};
                } else {
                    throw new Error('Invalid script. Expected a uri.');
                }
            } else {
                throw new Error('Invalid script. Expected a uri.');
            }
        } else if (token.isOperator()){
            return {operator : token.getValue()}; 
        } else {
            throw new Error('Invalid script. Expected method or operator');
        }
    }
};

module.exports = Parser;

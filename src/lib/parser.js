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
 * Should be 'operator uri' or just 'uri' which means GET 'uri'
 */
Parser.prototype.next = function() {
    if (this.tokenizer.hasMore()){
        var token = this.tokenizer.next();
        if (token.isMethod()){
            if (this.tokenizer.hasMore()){
                /**
                * @todo handle scripts where two methods appear adjacent
                */
                return {method: token.getValue(), uri: this.tokenizer.next().getValue()};
            }
        } else if (token.isOperator()){
            return {operator : token.getValue()}; 
        } else {
            // ought to check that token is not a method or operator, if so then it's an invalid script
            // for v1 at least
            return {method: 'GET', uri: token.getValue()};
        }
    }
};

module.exports = Parser;

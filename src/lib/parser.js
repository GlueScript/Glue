var Tokenizer = require('./tokenizer');

/**
 * Parser implements generating a set of commands from a script
 * It validates the script syntax is correct
 */
function Parser(string) {
    this.tokenizer = new Tokenizer(string);
};

/**
 * Return a command object with a method and endpoint property
 * Throw exception is script is invalid
 * Should be 'operator endpoint' or just 'endpoint' which means GET 'endpoint'
 */
Parser.prototype.next = function() {
    if (this.tokenizer.hasMore()){
        var token = this.tokenizer.next();
        if (token.isOperator()){
            if (this.tokenizer.hasMore()){
                /**
                * @todo handle scripts where two operators appear adjacent
                */
                return {method: token.getMethod(), endpoint: this.tokenizer.next().getValue()};
            }
        } else {
            return {method: 'GET', endpoint: token.getValue()};
        }
    }
};

module.exports = Parser;

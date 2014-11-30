var Tokenizer = require('./tokenizer');

function Parser(string) {
    this.tokenizer = new Tokenizer(string);
};

/**
 * Return a command object with a method and endpoint property
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

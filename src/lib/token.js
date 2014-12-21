var _ = require('underscore');

/**
 * Token class encapsulates a token with these public method
 *
 * @todo add isUri method?
 * isOperator - test if the token is a script operator, eg. / or + (split and join)
 * isMethod - test if the token is a script method, eg. POST
 * value - return the value of the token
 */
var operators = {
    '/' : 'split',
    '+' : 'join',
    '(' : 'start-group',
    ')' : 'end-group'
};

function Token(value) {
    this._value = value;
}

/**
 * Operators are used by the glue script executor to operate on the current 'data'
 * ie the body of the previous response
 */
Token.prototype.isOperator = function() {
    return _.has(operators, this._value);
};

/*
 * A method tells the glue script executor how to make the next request
 * extend to handle message queue interactions
 */
Token.prototype.isMethod = function() {
    return this._value.match(/^[A-Z]+$/);
};

/**
 * Valid uri in scripts must begin with a scheme followed by ://
 */
Token.prototype.isUri = function() {
    return this._value.match(/^[a-zA-Z]+:\/\/.+/);
};

Token.prototype.value = function() {
    if (this.isOperator()) {
        return operators[this._value];
    } else if (this.isUri() || this.isMethod()) {
        return this._value;
    }
};

module.exports = Token;

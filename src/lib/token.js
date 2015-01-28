var _ = require('underscore');

/**
 * Token class encapsulates a script token 
 * @todo add isNull method? add a pipe | operator
 *
 * isUri - test if the token is a uri
 * isOperator - test if the token is a script operator, eg. / or + (split and join)
 * isMethod - test if the token is a script method, eg. POST
 * value - return the value of the token
 * type - return the type of the token
 */
var operators = {
    '/' : 'split',
    '+' : 'join',
    '(' : 'start-group',
    ')' : 'end-group'
};

function Token(value) {
    var type = null;
    if (_.has(operators, value)) {
        type = 'operator';
        value = operators[value];
    } else if (value.match(/^[A-Z]+$/)) {
        type = 'method';
    } else if (value.match(/^[a-zA-Z]+:\/\/.+/)) {
        type = 'uri';
    } else {
        value = null;
    }

    Object.defineProperty(this, "value",{
        get: function () { return value; }
    });
    Object.defineProperty(this, "type",{
        get: function () { return type; }
    });
}

/**
 * Operators are used by the glue script executor to operate on the current 'data'
 * ie the body of the previous response
 */
Token.prototype.isOperator = function() {
    return this.type === 'operator';
};

/*
 * A method tells the glue script executor how to make the next request
 * extend to handle message queue interactions
 */
Token.prototype.isMethod = function() {
    return this.type === 'method';
};

/**
 * Valid uri in scripts must begin with a scheme followed by ://
 */
Token.prototype.isUri = function() {
    return this.type === 'uri';
};

module.exports = Token;

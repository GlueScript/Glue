/**
 * Token class encapsulates a token with these public method
 *
 * @todo add isUri method?
 * isOperator - test if the token is a script operator, eg. / or + (split and join)
 * isMethod - test if the token is a script method, eg. POST
 * @todo use getValue for all types
 * getMethod - convert script operators into a request method
 * getValue - return the value of the token
 */

function Token(value) {
    this.value = value;
}

/**
 * Operators are used by the glue script executor to operate on the current 'data'
 * ie the body of the previous response
 */
Token.prototype.isOperator = function() {
    return (this.value[0] == '/');
};

/*
 * A method tells the glue script executor how to make the next request
 * extend to handle message queue interactions
 */
Token.prototype.isMethod = function() {
    return (this.value[0] == '>');
};

/**
 * @obsolete - use getValue to retrieve all token strings
 */
Token.prototype.getMethod = function() {
    if ('>>' == this.value){
        return 'POST';
    }
};

Token.prototype.getValue = function() {
    return this.value;
};

module.exports = Token;

/**
 * Token class encapsulates a token with these public method
 *
 * @todo add isUri method?
 * isOperator - test if the token is a script operator, eg. / or + (split and join)
 * isMethod - test if the token is a script method, eg. POST
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
    return this.value.match(/^[A-Z]+$/);
};

/**
 * Valid uri in scripts must begin with a scheme followed by ://
 */
Token.prototype.isUri = function() {
    return this.value.match(/^[a-zA-Z]+:\/\/.+/);
};

Token.prototype.getValue = function() {
    if (this.isOperator()){
        if ('/' == this.value){
            return 'split';
        }
    } else if (this.isUri() || this.isMethod()){
        return this.value;
    }
};

module.exports = Token;

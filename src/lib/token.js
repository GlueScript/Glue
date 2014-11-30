/**
 * Token class encapsulates a token with these public method
 *
 * isOperator - test if the token is a script operator
 * getMethod - convert script operators into a request method
 * getValue - return the value of the token
 */

function Token(value) {
    this.value = value;
}

Token.prototype.isOperator = function() {
    return (this.value[0] == '>');
};

Token.prototype.getMethod = function() {
    if ('>>' == this.value){
        return 'POST';
    }
};

Token.prototype.getValue = function() {
    return this.value;
};

module.exports = Token;

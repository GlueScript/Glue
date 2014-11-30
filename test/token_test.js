var Token = require('../src/lib/token'),
    assert = require('assert');


describe('Token', function() {
    describe('isOperator', function() {
        it('should return true when token is an operator', function(){
            var value = '>>';
            var token = new Token(value);
            assert(token.isOperator());
        });
        it('should return false when token is empty', function(){
            var value = '';
            var token = new Token(value);
            assert(!token.isOperator());
        });
        it('should return false when token is not an operator', function(){
            var value = 'http://service.net/';
            var token = new Token(value);
            assert(!token.isOperator());
        });
    });
});


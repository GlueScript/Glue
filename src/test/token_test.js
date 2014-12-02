var Token = require('../lib/token'),
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
    describe('getValue', function() {
        it('should return token value', function(){
            var value = '>>';
            var token = new Token(value);
            assert.equal(value, token.getValue());
        });
    });
    describe('getMethod', function() {
        it('should return POST for >>', function(){
            var value = '>>';
            var token = new Token(value);
            assert.equal('POST', token.getMethod());
            assert(token.isOperator());
        });
        it('should return undefined if not an operator', function(){
            var value = 'http://service.com/';
            var token = new Token(value);
            assert.equal(undefined, token.getMethod());
            assert(!token.isOperator());
        });
        it('should return undefined if not a recognised operator', function(){
            var value = '>+';
            var token = new Token(value);
            assert.equal(undefined, token.getMethod());
            assert(token.isOperator());
        });
    });
});


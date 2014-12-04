var Token = require('../lib/token'),
    assert = require('assert');


describe('Token', function() {
    describe('isOperator', function() {
        it('should return true when token is split', function(){
            var value = '/';
            var token = new Token(value);
            assert(token.isOperator());
        });
        it('should return false when token is not recognised', function(){
            var value = '+';
            var token = new Token(value);
            assert(!token.isOperator());
        });
        it('should return false when token is empty', function(){
            var value = '';
            var token = new Token(value);
            assert(!token.isOperator());
        });
        it('should return false when token is a uri', function(){
            var value = 'http://service.net/';
            var token = new Token(value);
            assert(!token.isOperator());
        });
        it('should return false when token is a method', function(){
            var value = '>>';
            var token = new Token(value);
            assert(!token.isOperator());
        });
    });
    describe('getValue', function() {
        it('should return token value', function(){
            var value = 'http://filter.net/?q=w';
            var token = new Token(value);
            assert.equal(value, token.getValue());
        });
        it('should return token value for method', function(){
            var value = '>>';
            var token = new Token(value);
            assert.equal('POST', token.getValue());
        });
        it('should return null value for unrecognised method', function(){
            var value = '>+';
            var token = new Token(value);
            assert.equal(null, token.getValue());
        });
        it('should return split for /', function(){
            var value = '/';
            var token = new Token(value);
            assert.equal('split', token.getValue());
        });
    });
    describe('isMethod', function() {
        it('should return true for >>', function(){
            var value = '>>';
            var token = new Token(value);
            assert(token.isMethod());
        });
        it('should return false if a uri', function(){
            var value = 'http://service.com/';
            var token = new Token(value);
            assert(!token.isMethod());
        });
        it('should return false if empty', function(){
            var value = '';
            var token = new Token(value);
            assert(!token.isMethod());
        });
        it('should return false if an operator', function(){
            var value = '/';
            var token = new Token(value);
            assert(!token.isMethod());
        });
    });
});


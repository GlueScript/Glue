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
            var value = '*';
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
            var value = 'POST';
            var token = new Token(value);
            assert(!token.isOperator());
        });
    });

    describe('value', function() {
        it('should return token value', function(){
            var value = 'http://filter.net/?q=w';
            var token = new Token(value);
            assert.equal(value, token.value);
        });
        it('should return token value for method', function(){
            var value = 'POST';
            var token = new Token(value);
            assert.equal('POST', token.value);
        });
        it('should return null value for unrecognised token value', function(){
            var value = '>+';
            var token = new Token(value);
            assert.equal(null, token.value);
        });
        it('should return split for /', function(){
            var value = '/';
            var token = new Token(value);
            assert.equal('split', token.value);
        });
    });

    describe('isMethod', function() {
        it('should return true for POST', function(){
            var value = 'POST';
            var token = new Token(value);
            assert(token.isMethod());
        });
        it('should return true for GET', function(){
            var value = 'GET';
            var token = new Token(value);
            assert(token.isMethod());
        });
        it('should return true for PUT', function(){
            var value = 'PUT';
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

    describe('isUri', function() {
        it('should return true for a uri', function(){
            var value = 'http://service.net:88/path/?var=2&x=44+w#sss';
            var token = new Token(value);
            assert(token.isUri());
        });
        it('should return false for a method', function(){
            var value = 'POST';
            var token = new Token(value);
            assert(!token.isUri());
        });
        it('should return false for an operator', function(){
            var value = '/';
            var token = new Token(value);
            assert(!token.isUri());
         });
    });

    describe('_value', function() {
        it('cannot be modified', function() {
            var value = 'POST'
            var token = new Token(value);
            token.value = 'x';
            assert.equal(value, token.value);
        });
        it('cannot be deleted', function() {
            var value = 'POST'
            var token = new Token(value);
            delete token.value;
            assert.equal(value, token.value);
        });
    });
});


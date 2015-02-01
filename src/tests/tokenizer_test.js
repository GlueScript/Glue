var Tokenizer = require('../lib/tokenizer'),
    assert = require('assert');

describe('Tokenizer', function() {
    describe('hasMore', function() {
        it('should return true when one token exists', function(){
            var script = 'GET http://uri';
            var tokenizer = new Tokenizer(script);
            assert(tokenizer.hasMore());
        });
        it('should split tokens on carriage returns', function(){
            // there are 5 tokens
            var script = 'GET http://uri\n+ POST http://a';
            var tokenizer = new Tokenizer(script);
            tokenizer.next();
            tokenizer.next();
            tokenizer.next();
            tokenizer.next();
            assert(tokenizer.hasMore());
        });
        it('should return true when more tokens exist', function(){
            var script = 'GET http://uri POST http://service';
            var tokenizer = new Tokenizer(script);
            tokenizer.next();
            tokenizer.next();
            assert(tokenizer.hasMore());
        });
        it('should return false when no tokens exist', function() {
            var script = '';
            var tokenizer = new Tokenizer(script);
            assert.equal(false, tokenizer.hasMore());
        });
        it('should return false when no more tokens exist', function() {
            var script = 'token';
            var tokenizer = new Tokenizer(script);
            tokenizer.next();
            assert.equal(false, tokenizer.hasMore());
        });
    });

    describe('next', function() {
        it('should return tokens in order', function(){
            var script = 'GET http://uri POST http://service';
            var tokenizer = new Tokenizer(script);
            assert.equal('GET', tokenizer.next().value);
            assert.equal('http://uri', tokenizer.next().value);
            assert.equal('POST', tokenizer.next().value);
            assert.equal('http://service', tokenizer.next().value);
        });
        it('should ignore all whitespace', function(){
            var script = 'GET http://uri   POST    http://service';
            var tokenizer = new Tokenizer(script);
            assert.equal('GET', tokenizer.next().value);
            assert.equal('http://uri', tokenizer.next().value);
            assert.equal('POST', tokenizer.next().value);
            assert.equal('http://service', tokenizer.next().value);
        });
        it('should return undefined when no tokens exist', function(){
            var script = '';
            var tokenizer = new Tokenizer(script);
            assert.equal(undefined, tokenizer.next());
        });
    });

    describe('peek', function() {
        it('should return the next token', function() {
            var script = '{ "name": "dave" } > POST http://user-data-service/';
            var tokenizer = new Tokenizer(script);
            assert.equal('{', tokenizer.peek().value);
        });
        it('should not remove tokens', function() {
            var script = '{ "name": "dave" } > POST http://user-data-service/';
            var tokenizer = new Tokenizer(script);
            assert.equal('{', tokenizer.peek().value);
            assert.equal('{', tokenizer.peek().value);
        });
        it('should always return the current token', function() {
            var script = '{ "name": "dave" } > POST http://user-data-service/';
            var tokenizer = new Tokenizer(script);
            assert.equal('{', tokenizer.peek().value);
            tokenizer.next();
            assert.equal('"name":', tokenizer.peek().value);
            tokenizer.next();
            assert.equal('"dave"', tokenizer.peek().value);
        });
    });
});

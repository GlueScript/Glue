var Tokenizer = require('../src/lib/tokenizer'),
    assert = require('assert');

describe('Tokenizer', function() {
    describe('hasMore', function() {
        it('should return true when one token exists', function(){
            var script = 'uri';
            var tokenizer = new Tokenizer(script);
            assert(tokenizer.hasMore());
        });
        it('should return true when more tokens exist', function(){
            var script = 'uri >> service';
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
            var script = 'uri >> service';
            var tokenizer = new Tokenizer(script);
            assert.equal('uri', tokenizer.next().getValue());
            assert.equal('>>', tokenizer.next().getValue());
            assert.equal('service', tokenizer.next().getValue());
        });
        it('should ignore all whitespace', function(){
            var script = 'uri   >>    service';
            var tokenizer = new Tokenizer(script);
            assert.equal('uri', tokenizer.next().getValue());
            assert.equal('>>', tokenizer.next().getValue());
            assert.equal('service', tokenizer.next().getValue());
        });
        it('should return undefined when no tokens exist', function(){
            var script = '';
            var tokenizer = new Tokenizer(script);
            assert.equal(undefined, tokenizer.next());
        });
    });
});

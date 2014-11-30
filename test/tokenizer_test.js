var tokenizer = require('../src/lib/tokenizer'),
    assert = require('assert');


describe('Tokenizer', function(){
    describe('hasMore', function() {
        it('should return true when one token exists', function(){
            var script = 'uri';
            tokenizer.init(script);
            assert(tokenizer.hasMore());
        });
        it('should return true when more tokens exist', function(){
            var script = 'uri >> service';
            tokenizer.init(script);
            tokenizer.next();
            tokenizer.next();
            assert(tokenizer.hasMore());
        });
        it('should return false when no tokens exist', function() {
            var script = '';
            tokenizer.init(script);
            assert.equal(false, tokenizer.hasMore());
        });
        it('should return false when no more tokens exist', function() {
            var script = 'token';
            tokenizer.init(script);
            tokenizer.next();
            assert.equal(false, tokenizer.hasMore());
        });
    });
    describe('next', function() {
        it('should return tokens in order', function(){
            var script = 'uri >> service';
            tokenizer.init(script);
            assert.equal('uri', tokenizer.next());
            assert.equal('>>', tokenizer.next());
            assert.equal('service', tokenizer.next());
        });
        it('should ignore all whitespace', function(){
            var script = 'uri   >>    service';
            tokenizer.init(script);
            assert.equal('uri', tokenizer.next());
            assert.equal('>>', tokenizer.next());
            assert.equal('service', tokenizer.next());
        });
        it('should return undefined when no tokens exist', function(){
            var script = '';
            tokenizer.init(script);
            assert.equal(undefined, tokenizer.next());
        });
    });
});

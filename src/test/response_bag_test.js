var ResponseBag = require('../lib/response_bag'),
    assert = require('assert');

describe('ResponseBag', function() {
    describe('construct', function() {
        it('should have a total size', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            assert.equal(value, response_bag.totalSize());
        });
        it('should have a current size', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            assert.equal(0, response_bag.currentSize());
        });
        it('should not be complete', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            assert(!response_bag.complete());
        });
    });
    describe('push', function() {
        it('should add a response', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            response_bag.push(null, 'response body');
            assert(!response_bag.complete());
        });
    });
});


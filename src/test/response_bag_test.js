var ResponseBag = require('../lib/response_bag'),
    Payload = require('../lib/payload'),
    assert = require('assert');

describe('ResponseBag', function() {
    describe('construct', function() {
        it('should have a total size', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            assert.equal(value, response_bag.total());
        });
        it('should have a current size of zero', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            assert.equal(0, response_bag.currentSize());
        });
        it('should not be full', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            assert(!response_bag.full());
        });
    });
    describe('push', function() {
        it('should add a response', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            response_bag.push(null, new Payload('response body'));
            assert(!response_bag.full());
        });
        it('should fill a bag', function(){
            var value = 1;
            var response_bag = new ResponseBag(value);
            response_bag.push(null, new Payload('response body'));
            assert(response_bag.full());
        });
        it('should increase current size', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            response_bag.push(null, new Payload('response body'));
            assert.equal(1, response_bag.currentSize());
            response_bag.push(null, new Payload('response body'));
            assert.equal(2, response_bag.currentSize());
        });
    });
    describe('full', function() {
        it('should be false when current is less than total', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            response_bag.push(null, new Payload('response body'));
            assert(!response_bag.full());
        });
        it('should be true when current equals total', function(){
            var value = 2;
            var response_bag = new ResponseBag(value);
            response_bag.push(null, new Payload('response body'));
            response_bag.push(null, new Payload('response body'));
            assert(response_bag.full());
        });
    });
    describe('errors', function() {
        it('should be false when bag is empty', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            assert(!response_bag.errors());
        });
        it('should be false when no errors exist', function(){
            var value = 2;
            var response_bag = new ResponseBag(value);
            response_bag.push(null, new Payload('response body'));
            assert(!response_bag.errors());
        });
        it('should be true when errors exist', function(){
            var value = 2;
            var response_bag = new ResponseBag(value);
            response_bag.push('Error: request timedout', new Payload('response body'));
            assert(response_bag.errors());
        });
    });
    describe('responses', function() {
        it('should be empty when bag is empty', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            assert.equal(0, response_bag.responses().length);
        });
        it('should contain all responses', function(){
            var value = 10;
            var response_bag = new ResponseBag(value);
            assert.equal(0, response_bag.responses().length);
            response_bag.push(null, new Payload('response body'));
            assert.equal(1, response_bag.responses().length);

            var response = response_bag.responses()[0];
            assert.equal(null, response.error);
        });
    });
    describe('join', function() {
        it('should be empty when bag is empty', function(){
            var response_bag = new ResponseBag(10);
            var payload = response_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, '');
        });
        it('should return a single Payload when there is only one response', function(){
            var response_bag = new ResponseBag(10);
            response_bag.push(null, new Payload('response body'));
            var payload = response_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, 'response body');
        });
        it('should return a single Payload containing multiple payloads', function(){
            var response_bag = new ResponseBag(10);
            response_bag.push(null, new Payload('response body 1'));
            response_bag.push(null, new Payload('response body 2'));
            response_bag.push(null, new Payload('response body 3'));
            var payload = response_bag.join();
            assert(payload instanceof Payload);
            var value = JSON.stringify(['response body 1', 'response body 2', 'response body 3']);
            assert.equal(payload.content, value);
        });
    });
});

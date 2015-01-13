var PayloadBag = require('../lib/payload_bag'),
    Payload = require('../lib/payload'),
    assert = require('assert');

describe('PayloadBag', function() {
    describe('construct', function() {
        it('should have a total size', function(){
            var value = 10;
            var payload_bag = new PayloadBag(value);
            assert.equal(value, payload_bag.total());
        });
        it('should have a current size of zero', function(){
            var value = 10;
            var payload_bag = new PayloadBag(value);
            assert.equal(0, payload_bag.currentSize());
        });
        it('should not be full', function(){
            var value = 10;
            var payload_bag = new PayloadBag(value);
            assert(!payload_bag.full());
        });
    });
    describe('push', function() {
        it('should add a response', function(){
            var value = 10;
            var payload_bag = new PayloadBag(value);
            payload_bag.push(null, new Payload('response body'));
            assert(!payload_bag.full());
        });
        it('should fill a bag', function(){
            var value = 1;
            var payload_bag = new PayloadBag(value);
            payload_bag.push(null, new Payload('response body'));
            assert(payload_bag.full());
        });
        it('should increase current size', function(){
            var value = 10;
            var payload_bag = new PayloadBag(value);
            payload_bag.push(null, new Payload('response body'));
            assert.equal(1, payload_bag.currentSize());
            payload_bag.push(null, new Payload('response body'));
            assert.equal(2, payload_bag.currentSize());
        });
    });
    describe('full', function() {
        it('should be false when current is less than total', function(){
            var value = 10;
            var payload_bag = new PayloadBag(value);
            payload_bag.push(null, new Payload('response body'));
            assert(!payload_bag.full());
        });
        it('should be true when current equals total', function(){
            var value = 2;
            var payload_bag = new PayloadBag(value);
            payload_bag.push(null, new Payload('response body'));
            payload_bag.push(null, new Payload('response body'));
            assert(payload_bag.full());
        });
    });
    describe('errors', function() {
        it('should be false when bag is empty', function(){
            var value = 10;
            var payload_bag = new PayloadBag(value);
            assert(!payload_bag.errors());
        });
        it('should be false when no errors exist', function(){
            var value = 2;
            var payload_bag = new PayloadBag(value);
            payload_bag.push(null, new Payload('response body'));
            assert(!payload_bag.errors());
        });
        it('should be true when errors exist', function(){
            var value = 2;
            var payload_bag = new PayloadBag(value);
            payload_bag.push('Error: request timedout', new Payload('response body'));
            assert(payload_bag.errors());
        });
    });
    describe('join', function() {
        it('should be empty when bag is empty', function(){
            var payload_bag = new PayloadBag(10);
            var payload = payload_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, '');
        });
        it('should return a single Payload when there is only one response', function(){
            var payload_bag = new PayloadBag(10);
            payload_bag.push(null, new Payload('response body'));
            var payload = payload_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, 'response body');
        });
        it('should return a single Payload containing multiple payloads', function(){
            var payload_bag = new PayloadBag(10);
            var responses = ['r a', 'r b', 'r c'];
            payload_bag.push(null, new Payload(responses[0]));
            payload_bag.push(null, new Payload(responses[1]));
            payload_bag.push(null, new Payload(responses[2]));
            var payload = payload_bag.join();
            assert(payload instanceof Payload);
            var value = JSON.stringify(responses);
            assert.equal(payload.content, value);
        });
        it('should merge top level arrays', function(){
            var payload_bag = new PayloadBag(3);
            var responses = [['z', 'a'], ['y', 'b']];
            payload_bag.push(null, new Payload(responses[0], 'application/json; charset=utf-8'));
            payload_bag.push(null, new Payload(responses[1], 'application/json; charset=utf-8'));

            var payload = payload_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, JSON.stringify(['z', 'a', 'y', 'b']));
        });
        it('should merge top level json arrays', function(){
            var payload_bag = new PayloadBag(3);
            var responses = [JSON.stringify(['z', 'a']), JSON.stringify(['y', 'b'])];
            payload_bag.push(null, new Payload(responses[0], 'application/json'));
            payload_bag.push(null, new Payload(responses[1], 'application/json'));

            var payload = payload_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, JSON.stringify(['z', 'a', 'y', 'b']));
        });
    });
});

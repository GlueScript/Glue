var PayloadBag = require('../lib/payload_bag'),
    Payload = require('../lib/payload'),
    assert = require('assert');

describe('PayloadBag', function() {
    describe('errors', function() {
        it('should be false when bag is empty', function(){
            var payload_bag = new PayloadBag();
            assert(!payload_bag.errors());
        });
        it('should be false when no errors exist', function(){
            var payload_bag = new PayloadBag();
            payload_bag.push(null, new Payload('response body'));
            assert(!payload_bag.errors());
        });
        it('should be true when errors exist', function(){
            var payload_bag = new PayloadBag();
            payload_bag.push('Error: request timedout', new Payload('response body'));
            assert(payload_bag.errors());
        });
    });
    describe('join', function() {
        it('should be empty when bag is empty', function(){
            var payload_bag = new PayloadBag();
            var payload = payload_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, '');
        });
        it('should return a single Payload when there is only one response', function(){
            var payload_bag = new PayloadBag();
            payload_bag.push(null, new Payload('response body'));
            var payload = payload_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, 'response body');
        });
        it('should return a single Payload containing multiple payloads', function(){
            var payload_bag = new PayloadBag();
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
            var payload_bag = new PayloadBag();
            var responses = [['z', 'a'], ['y', 'b']];
            payload_bag.push(null, new Payload(responses[0], 'application/json; charset=utf-8'));
            payload_bag.push(null, new Payload(responses[1], 'application/json; charset=utf-8'));

            var payload = payload_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, JSON.stringify(['z', 'a', 'y', 'b']));
        });
        it('should merge top level json arrays', function(){
            var payload_bag = new PayloadBag();
            var responses = [JSON.stringify(['z', 'a']), JSON.stringify(['y', 'b'])];
            payload_bag.push(null, new Payload(responses[0], 'application/json'));
            payload_bag.push(null, new Payload(responses[1], 'application/json'));

            var payload = payload_bag.join();
            assert(payload instanceof Payload);
            assert.equal(payload.content, JSON.stringify(['z', 'a', 'y', 'b']));
        });
    });
});

var Payload = require('../lib/payload'),
    assert = require('assert');


describe('Payload', function() {
    describe('type', function() {
        it('should convert array to json', function(){
            var value = ['a','b','c'];
            var payload = new Payload(value);
            assert.equal('application/json', payload.type);
            assert.equal(JSON.stringify(value), payload.content);
        });

        it('should convert object to json', function(){
            var value = {a : 'A', b : 'B', c: 'C'};
            var payload = new Payload(value);
            assert.equal('application/json', payload.type);
            assert.equal(JSON.stringify(value), payload.content);
        });

        it('should treat json string as json', function(){
            var value = JSON.stringify({a : 'A', b : 'B', c: 'C'});
            var payload = new Payload(value);
            assert.equal('application/json', payload.type);
            assert.equal(value, payload.content);
        });

        it('should treat unformatted string as text/plain', function(){
            var value = 'A plain old string';
            var payload = new Payload(value);
            assert.equal('text/plain', payload.type);
            assert.equal(value, payload.content);
        });
    });
});


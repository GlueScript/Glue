var Payload = require('../lib/payload'),
    assert = require('assert');

describe('Payload', function() {
    describe('construct', function() {
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

        it('should treat a json string as json', function(){
            var value = JSON.stringify({a : 'A', b : 'B', c: 'C'});
            var payload = new Payload(value);
            assert.equal('application/json', payload.type);
            assert.equal(value, payload.content);
        });

        it('should treat an unformatted string as text/plain', function(){
            var value = 'A plain old string';
            var payload = new Payload(value);
            assert.equal('text/plain', payload.type);
            assert.equal(value, payload.content);
        });

        it('should treat an xml string as application/xml', function(){
            var value = '<?xml version="1.0" encoding="UTF-8" ?>' + "\n" + '<root>Value</root>';
            var payload = new Payload(value);
            assert.equal('application/xml', payload.type);
            assert.equal(value, payload.content);
        });

        it('should treat a html string as text/html', function(){
            var value = '<html>' + "\n" + '<html><head></head><body></body></html>';
            var payload = new Payload(value);
            assert.equal('text/html', payload.type);
            assert.equal(value, payload.content);
        });

        it('should treat a broken xml string as text/plain', function(){
            var value = '<?xml version="1.0" encoding="UTF-8" ?>' + "\n" + '<root Value</root>';
            var payload = new Payload(value);
            assert.equal('text/plain', payload.type);
            assert.equal(value, payload.content);
        });
    });

    describe('split', function() {

        it('should return array with one item when not json array', function(){
            var value = 'a plain text string';
            var payload = new Payload(value);
            var payloads = payload.split();
            assert.equal(1, payloads.length);
            assert(payloads[0] instanceof Payload);
            assert.equal(value, payloads[0].content);
        });

        it('should return array with one item when a json object', function(){
            var value = JSON.stringify({a: 'AAA'});
            var payload = new Payload(value);
            var payloads = payload.split();
            assert.equal(1, payloads.length);
            assert(payloads[0] instanceof Payload);
            assert.equal(value, payloads[0].content);
        });

        it('should return array with many items when a json array', function(){
            var value = JSON.stringify(['a', 'b', 'c']);
            var payload = new Payload(value);
            var payloads = payload.split();
            assert.equal(3, payloads.length);
            assert(payloads[0] instanceof Payload);
            assert.equal('a', payloads[0].content);
            assert(payloads[1] instanceof Payload);
            assert.equal('b', payloads[1].content);
            assert(payloads[2] instanceof Payload);
            assert.equal('c', payloads[2].content);
        });

    });
});

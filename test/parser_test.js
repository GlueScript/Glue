var Parser = require('../src/lib/parser'),
    assert = require('assert');


describe('Parser', function() {
    describe('next', function() {

        it('should return a command when one exists', function() {
            var script = 'uri';
            var parser = new Parser(script);
            
            var command = parser.next();
            assert.equal('GET', command.method);
            assert.equal('uri', command.uri);
        });

        it('should return all commands when they exist', function() {
            var script = 'uri >> service';
            var parser = new Parser(script);

            var command = parser.next();
            assert.equal('GET', command.method);
            assert.equal('uri', command.uri);

            var command = parser.next();
            assert.equal('POST', command.method);
            assert.equal('service', command.uri);
        });
    });
});

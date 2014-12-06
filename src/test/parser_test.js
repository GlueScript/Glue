var Parser = require('../lib/parser'),
    assert = require('assert');


describe('Parser', function() {
    describe('next', function() {

        it('should return a command when one exists', function() {
            var script = 'uri';
            var parser = new Parser(script);
            
            var command = parser.next();
            assert.equal('GET', command.method);
            assert.equal('uri', command.uri);

            assert.equal(null, parser.next());
        });

        it('should return no commands when none exist', function() {
            var script = '';
            var parser = new Parser(script);
            
            assert.equal(null, parser.next());
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

            assert.equal(null, parser.next());
        });

        it('should handle split operator', function() {
            var script = 'uri / >> service';
            var parser = new Parser(script);

            var command = parser.next();
            assert.equal('GET', command.method);
            assert.equal('uri', command.uri);

            command = parser.next();
            assert.equal('split', command.operator);

            command = parser.next();
            assert.equal('POST', command.method);
            assert.equal('service', command.uri);

            assert.equal(null, parser.next());
        });
    });
});

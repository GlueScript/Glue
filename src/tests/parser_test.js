var Parser = require('../lib/parser'),
    assert = require('assert');


describe('Parser', function() {
    describe('next', function() {

        it('should return a command when one exists', function() {
            var script = 'GET http://uri';
            var parser = new Parser(script);
            
            var command = parser.next();
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            assert.equal(null, parser.next());
        });

        it('should return no commands when none exist', function() {
            var script = '';
            var parser = new Parser(script);
            
            assert.equal(null, parser.next());
        });

        it('should return no commands when only uri is present', function() {
            var script = 'http://service/';
            var parser = new Parser(script);
            
            assert.equal(null, parser.next());
        });

        it('should return no commands when only operator is present', function() {
            var script = 'GET http://service/ http://other.net/';
            var parser = new Parser(script);
            //remove first command
            var cmd = parser.next();

            assert.equal(null, parser.next());
        });

        it('should return all commands when they exist', function() {
            var script = 'GET http://uri POST http://service';
            var parser = new Parser(script);

            var command = parser.next();
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            var command = parser.next();
            assert.equal('POST', command.method);
            assert.equal('http://service', command.uri);

            assert.equal(null, parser.next());
        });

        it('should handle split operator', function() {
            var script = 'GET http://uri / POST http://service';
            var parser = new Parser(script);

            var command = parser.next();
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            command = parser.next();
            assert.equal('split', command.operator);

            command = parser.next();
            assert.equal('POST', command.method);
            assert.equal('http://service', command.uri);

            assert.equal(null, parser.next());
        });
    });
});

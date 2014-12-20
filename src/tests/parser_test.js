var Parser = require('../lib/parser'),
    assert = require('assert');


describe('Parser', function() {
    describe('next', function() {

        it('should return a command when one exists', function() {
            var script = 'GET http://uri';
            var parser = new Parser(script);
            
            var next = parser.next();
            assert.equal(1, next.commands.length);
            var command = next.commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            assert.equal(null, parser.next());
        });

        it('should return no commands when none exist', function() {
            var script = '';
            var parser = new Parser(script);
            
            assert.equal(null, parser.next());
        });

        it('should throw Error when only uri is present', function() {
            var script = 'http://service/';
            var parser = new Parser(script);
            
            assert.throws(function () {parser.next();}, Error, 'Invalid script. Expected a method or operator.');
        });

        it('should throw Error when only uri is left', function() {
            var script = 'GET http://service/ http://other.net/';
            var parser = new Parser(script);
            //remove first command
            var cmd = parser.next();

            assert.throws(function () {parser.next();}, Error, 'Invalid script. Expected a method or operator.');
        });

        it('should throw Error when only method is present', function() {
            var script = 'GET'; 
            var parser = new Parser(script);
            assert.throws(function () {parser.next();}, Error, 'Invalid script. Expected a uri.');
        });

        it('should return all commands when they exist', function() {
            var script = 'GET http://uri POST http://service';
            var parser = new Parser(script);

            var command = parser.next().commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            command = parser.next().commands[0];
            assert.equal('POST', command.method);
            assert.equal('http://service', command.uri);

            assert.equal(null, parser.next());
        });

        it('should handle split operator', function() {
            var script = 'GET http://uri / POST http://service';
            var parser = new Parser(script);

            var command = parser.next().commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            var next = parser.next();
            assert.equal('split', next.operator);

            command = parser.next().commands[0];
            assert.equal('POST', command.method);
            assert.equal('http://service', command.uri);

            assert.equal(null, parser.next());
        });

        it('should reject two methods in a row', function() {
            var script = 'GET POST http://service';
            var parser = new Parser(script);

            assert.throws(function () {parser.next();}, Error, 'Invalid script. Expected a uri.');
        });
    });
});

var Parser = require('../lib/parser'),
    Tokenizer = require('../lib/tokenizer'),
    assert = require('assert');


describe('Parser', function() {
    describe('next', function() {

        it('should return a command when one exists', function() {
            var script = 'GET http://uri';
            var parser = new Parser(new Tokenizer(script));
            
            var next = parser.next();
            assert.equal(1, next.commands.length);
            var command = next.commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            assert.equal(null, parser.next());
        });

        it('should return read-only commands', function() {
            var script = 'GET http://uri';
            var parser = new Parser(new Tokenizer(script));
            
            var next = parser.next();
            assert.equal(1, next.commands.length);
            var command = next.commands[0];
            command.method = 'POST';
            assert.equal('GET', command.method);
            command.uri = 'invalid';
            assert.equal('http://uri', command.uri);
        });

        it('should return no commands when none exist', function() {
            var script = '';
            var parser = new Parser(new Tokenizer(script));
            
            assert.equal(null, parser.next());
        });

        it('should throw Error when only uri is present', function() {
            var script = 'http://service/';
            var parser = new Parser(new Tokenizer(script));
            
            assert.throws(function () {parser.next();}, Error, 'Invalid script. Expected a method or operator.');
        });

        it('should throw Error when only uri is left', function() {
            var script = 'GET http://service/ http://other.net/';
            var parser = new Parser(new Tokenizer(script));
            //remove first command
            var cmd = parser.next();

            assert.throws(function () {parser.next();}, Error, 'Invalid script. Expected a method or operator.');
        });

        it('should throw Error when only method is present', function() {
            var script = 'GET'; 
            var parser = new Parser(new Tokenizer(script));
            assert.throws(function () {parser.next();}, Error, 'Invalid script. Expected a uri.');
        });

        it('should return all commands when they exist', function() {
            var script = 'GET http://uri POST http://service';
            var parser = new Parser(new Tokenizer(script));

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
            var parser = new Parser(new Tokenizer(script));

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

        it('should handle pipe operator', function() {
            var script = 'GET http://uri > POST http://service';
            var parser = new Parser(new Tokenizer(script));

            var command = parser.next().commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            command = parser.next().commands[0];
            assert.equal('POST', command.method);
            assert.equal('http://service', command.uri);

            assert.equal(null, parser.next());
        });

        it('should reject two methods in a row', function() {
            var script = 'GET POST http://service';
            var parser = new Parser(new Tokenizer(script));

            assert.throws(function () {parser.next();}, Error, 'Invalid script. Expected a uri.');
        });

        it('should handle group commands', function() {
            var script = 'GET http://uri + ( POST http://a POST http://b )';
            var parser = new Parser(new Tokenizer(script));

            var command = parser.next().commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            var next = parser.next();
            
            assert(next.commands instanceof Array);

            assert.equal('POST', next.commands[0].method);
            assert.equal('http://a', next.commands[0].uri);

            assert.equal('POST', next.commands[1].method);
            assert.equal('http://b', next.commands[1].uri);

            assert.equal(null, parser.next());
        });

        it('should throw an error for group without start', function() {
            var script = 'GET http://uri + POST http://a POST http://b POST http://c)';
            var parser = new Parser(new Tokenizer(script));

            var command = parser.next().commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            assert.throws(function () {parser.next();}, Error, 'Invalid script. Start-group must follow join');
            
        });

        it('should throw an error for group without end', function() {
            var script = 'GET http://uri + ( POST http://a POST http://b POST http://c';
            var parser = new Parser(new Tokenizer(script));

            var command = parser.next().commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            assert.throws(function () {parser.next();}, Error, 'Invalid script. End-group must end a group of commands');
            
        });

        it('should throw an error for group that starts with uri', function() {
            var script = 'GET http://uri + ( http://a POST http://b )';
            var parser = new Parser(new Tokenizer(script));

            var command = parser.next().commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            assert.throws(function () {parser.next();}, Error, 'Invalid script. Group must start with a uri');
            
        });

        it('should handle groups in the middle of scripts', function() {
            var script = 'GET http://uri + ( POST http://a POST http://b ) POST http://c';
            var parser = new Parser(new Tokenizer(script));

            var command = parser.next().commands[0];
            assert.equal('GET', command.method);
            assert.equal('http://uri', command.uri);

            commands = parser.next().commands;
            assert.equal(2, commands.length);
            assert.equal('POST', commands[0].method);
            assert.equal('http://a', commands[0].uri);
            assert.equal('POST', commands[1].method);
            assert.equal('http://b', commands[1].uri);

            commands = parser.next().commands;
            assert.equal(1, commands.length);
            assert.equal('POST', commands[0].method);
            assert.equal('http://c', commands[0].uri);
        });

        it('should handle groups at the start of scripts', function() {
            var script = '+ ( GET http://uri GET http://a ) POST http://b';
            var parser = new Parser(new Tokenizer(script));

            var commands = parser.next().commands;
            assert.equal('GET', commands[0].method);
            assert.equal('http://uri', commands[0].uri);

            assert.equal('GET', commands[1].method);
            assert.equal('http://a', commands[1].uri);
            
            commands = parser.next().commands;

            assert.equal('POST', commands[0].method);
            assert.equal('http://b', commands[0].uri);
        });

        it('should handle groups after split', function() {
            var script = 'GET http://a / + ( POST http://b POST http://c )';
            var parser = new Parser(new Tokenizer(script));

            var commands = parser.next().commands;
            assert.equal(1, commands.length);
            assert.equal('GET', commands[0].method);
            assert.equal('http://a', commands[0].uri);
            
            assert.equal('split', parser.next().operator);

            commands = parser.next().commands;
            assert.equal('POST', commands[0].method);
            assert.equal('http://b', commands[0].uri);
            
            assert.equal('POST', commands[1].method);
            assert.equal('http://c', commands[1].uri);
        });

        it('should handle multiple groups in one script', function() {
            var script = '+ ( GET http://a GET http://b ) / POST http://c POST http://c2 / POST http://c3 + ( POST http://d POST http://e )';
            var parser = new Parser(new Tokenizer(script));

            var commands = parser.next().commands;
            assert.equal(2, commands.length);
            assert.equal('GET', commands[0].method);
            assert.equal('http://a', commands[0].uri);
            assert.equal('GET', commands[1].method);
            assert.equal('http://b', commands[1].uri);
            
            assert.equal('split', parser.next().operator);

            commands = parser.next().commands;
            assert.equal(1, commands.length);
            assert.equal('POST', commands[0].method);
            assert.equal('http://c', commands[0].uri);

            commands = parser.next().commands;
            assert.equal(1, commands.length);
            assert.equal('POST', commands[0].method);
            assert.equal('http://c2', commands[0].uri);

            assert.equal('split', parser.next().operator);

            commands = parser.next().commands;
            assert.equal(1, commands.length);
            assert.equal('POST', commands[0].method);
            assert.equal('http://c3', commands[0].uri);
            
            commands = parser.next().commands;
            assert.equal(2, commands.length);
            assert.equal('POST', commands[0].method);
            assert.equal('http://d', commands[0].uri);
            assert.equal('POST', commands[1].method);
            assert.equal('http://e', commands[1].uri);
        });

        it('should handle payload content in scripts', function() {
            var script = '{ "name" : "Freddy" } > POST http://account.service/';
            var parser = new Parser(new Tokenizer(script));
            var next = parser.next();

            assert.equal('application/json', next.payload.type);
            assert.equal("Freddy", next.payload.value.name);
        });
    });
});

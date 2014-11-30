var parser = require('../src/lib/parser'),
    assert = require('assert');


describe('Parser', function() {
    describe('next', function() {
        it('should return a command when one exists', function(){
            var script = 'uri';
            parser.init(script);
            
            var command = parser.next();
            assert.equal('GET', command.method);
            assert.equal('uri', command.endpoint);
        });
        it('should return all commands when they exist', function(){
            var script = 'uri >> service';
            parser.init(script);

            var command = parser.next();
            assert.equal('GET', command.method);
            assert.equal('uri', command.endpoint);

            var command = parser.next();
            assert.equal('POST', command.method);
            assert.equal('service', command.endpoint);
        });
    });
});

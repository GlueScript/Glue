var parser = require('../src/lib/parser'),
    assert = require('assert');


describe('Parser', function() {
    describe('next', function() {
        it('should return a command when one exists', function(){
            var script = 'uri';
            parser.init(script);
            var command = parser.next();
            assert.equal('GET', command.method);
        });
    });
});

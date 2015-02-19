var ScriptBuilder = require('../lib/script_builder'),
    mockman = require('mockman'),
    assert = require('assert'),
    _ = require('underscore');

describe('ScriptBuilder', function() {

    after(function(done){
        mockman.close();
        done();
    });
    
    describe('generate', function() {
        it('should create a unique id', function() {
            var mock_store_builder = mockman.instance('../lib/store').shouldReceive('add').once().willReturn(null);
            var script = 'GET https://xyz.net';
            var builder = new ScriptBuilder(mock_store_builder.getMock()());
            var id = builder.generate(script);
            // assert id is not null
            assert(_.isString(id));
        });
    });
});


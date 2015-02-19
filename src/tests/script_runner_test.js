var ScriptRunner = require('../lib/script_runner'),
    mockman = require('mockman'),
    assert = require('assert'),
    _ = require('underscore');

describe('ScriptRunner', function() {

    after(function(done){
        mockman.close();
        done();
    });
    
    describe('generate', function() {
        it('should create a unique id', function() {
            var mock_store_builder = mockman.instance('../lib/store').shouldReceive('add').once().willReturn(null);
            var script = 'GET https://xyz.net';
            var runner = new ScriptRunner(mock_store_builder.getMock()());
            var id = runner.generate(script);
            // assert id is not null
            assert(_.isString(id));
        });
    });
});


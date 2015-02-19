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
        it('should create a Script', function() {
            // need to mock Store
            //var mock_store_builder = mockman.instance('../lib/store').shouldReceive('add').once().willReturn(null);
            var script = 'GET https://xyz.net';
            var new_script = ScriptBuilder.generate(script);

            assert(_.isString(new_script.id));
            assert(script == new_script.body);
            assert(0 == new_script.state);
            assert(_.isDate(new_script.date));
        });
    });
});


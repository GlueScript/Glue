var ScriptRunner = require('../lib/script_runner'),
    mockman = require('mockman'),
    assert = require('assert');

describe('ScriptRunner', function() {
    
    describe('newScript', function() {
        it('should create a unique id', function() {
            var script = 'GET https://xyz.net';
            var runner = new ScriptRunner();
            var id = runner.newScript(script);
        });
    });
});


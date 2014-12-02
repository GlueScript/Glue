var Exe = require('../lib/exe'),
    //mockman = require('../src/node_modules/mockman/lib/mockman'),
    mockman = require('mockman'),
    assert = require('assert');

describe('Exe', function() {
    describe('run', function() {
        it('should call callback when complete', function() {
            var script = 'http://server.net/ >> service';
            var mock = mockman.instance('../src/lib/parser');
            var exe = new Exe(mock.getMock(), function(result){
               console.log(result); 
            });
            exe.run();
        });
    });
});

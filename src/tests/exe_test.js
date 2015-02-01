var Exe = require('../lib/exe'),
    mockman = require('mockman'),
    assert = require('assert');

describe('Exe', function() {

    after(function(done){
        mockman.close();
        done();
    });

    describe('run', function() {
        it('should call parser.next() once if no commands exist', function() {
            var mock_builder = mockman.instance('../lib/parser').shouldReceive('next').once().willReturn(null);
            var exe = new Exe(mock_builder.getMock()());
            exe.start(function(error, result){} );
        });

        it('should call callback on end', function() {
            var mock_builder = mockman.instance('../lib/parser').shouldReceive('next').once().willReturn(null);
            
            // set up a mock that expects to be called once the script is complete and pass inside the callback function
            var mock_response = mockman.instance('response').shouldReceive('json').once().getMock()();
            var exe = new Exe(mock_builder.getMock()());
            exe.start(function(result) { mock_response.json(result); } );
        });
    });
});

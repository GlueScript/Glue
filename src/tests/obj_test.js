var Obj = require('../lib/obj'),
    assert = require('assert');

describe('lock', function() {
    
    it('should return a locked copy', function(){
        
        var o = {'name': 'colin', 'age': 38};

        var locked = Obj.lock(o);
        
        assert.equal(locked.name, o.name);
        assert.equal(locked.age, o.age);
        
        locked.name = 'other';
        assert.equal(locked.name, o.name);
        locked.age = 'xyz';
        assert.equal(locked.age, o.age);
    });

});

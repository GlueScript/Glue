var Script = require('../lib/script'),
    assert = require('assert'),
    _ = require('underscore');

describe('Script', function() {

    describe('new', function() {
        it('should create a Script', function() {
            var body = 'GET https://xyz.net';
            var script = new Script(body);

            assert(body == script.body, 'Expected script.body to be the same as constructor arg');
            assert(_.isString(script.id), 'Expected script.id to be a string');
            assert(0 == script.state, 'Expected script default state to be 0');
            assert(_.isDate(script.date), 'Expected script.date to be a Date');
        });
    });
});


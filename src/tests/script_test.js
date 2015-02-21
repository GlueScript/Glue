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

    describe('next', function() {
        it('should return a command and update state', function() {
            var body = 'GET https://xyz.net';
            var script = new Script(body);
            
            var command = script.next();
            assert(command instanceof Object);
            assert(2 == script.state, 'Expected script state to be 2');
        });
    });
});


/**
 * Test the server script
 */
var server = require('../server'),
    request = require('supertest');

describe('GET /', function() {

    beforeEach(function(done) {
        server.start(8080);
        done();
    });

    it('responds with json', function(done) {

        request(server.app)
            .get('/')
            .set('Accept', 'text/plain')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('POST /', function() {
    
    beforeEach(function(done) {
        server.start(8090);
        done();
    });
    
    it('responds with success for empty script', function(done) {
        request(server.app)
            .post('/')
            .set('Content-Type', 'text/plain')
            .send('')
            .expect(200, done);
    });
});

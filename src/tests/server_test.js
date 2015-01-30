/**
 * Test the server script
 */
var server = require('../server'),
    request = require('supertest'),
    nock = require('nock');

describe('GET /', function() {

    before(function(done) {
        server.start();
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
    
    before(function(done) {
        server.start();
        done();
    });
    
    it('responds with success for empty script', function(done) {
        request(server.app)
            .post('/')
            .set('Content-Type', 'text/plain')
            .send('')
            .expect(200, done);
    });
    
    it('responds with success for single command script', function(done) {
        // mock the thing endpoint
        var endpoint = 'http://testing';

        var mock = nock(endpoint)
            .get('/1')
            .reply(200, {
                data: "text"
            });

        request(server.app)
            .post('/')
            .set('Content-Type', 'text/plain')
            .send('GET ' + endpoint + '/1')
            .expect(200, done);
    });
});

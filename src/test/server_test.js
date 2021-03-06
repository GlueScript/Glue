/**
 * Test the server script
 */
var server = require('../server'),
    request = require('supertest'),
    nock = require('nock'),
    Config = require('../config');


describe('server', function() {

    before(function(done) {
        server.start();
        done();
    });
    
    after(function(done) {
        Config.getStore().clear(done);
    });

    describe('GET /', function() {
        it('responds with json', function(done) {
            request(server.app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('POST /', function() {
        it('responds with success for empty script', function(done) {
            request(server.app)
                .post('/')
                .set('Content-Type', 'text/plain')
                .send('')
                .expect(200, done);
        });
    
        it('responds with success for single command script', function(done) {
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
    
        it('pipes one response into the next request', function(done) {
            var first_response = {data: 'text'};
            var first = 'http://testing';

            var mock_first = nock(first)
                .get('/1', '')
                .reply(200, first_response);

            var second = 'http://second';

            var mock_second = nock(second)
                .post('/', first_response)
                .reply(200, {
                    data: "text"
                });

            request(server.app)
                .post('/')
                .set('Content-Type', 'text/plain')
                .send('GET ' + first + '/1' + ' > POST ' + second + '/')
                .expect(200, done);
        });
    
        it('fails when one request fails', function(done) {
            var first_response = {data: 'text'};
            var first = 'http://testing';

            var mock_first = nock(first)
                .get('/1', '')
                .reply(200, first_response);

            var second = 'http://second';

            var mock_second = nock(second)
                .post('/', first_response)
                .reply(404);

            request(server.app)
                .post('/')
                .set('Content-Type', 'text/plain')
                .send('GET ' + first + '/1' + ' > POST ' + second + '/')
                .expect(400, done);
        });
    
        it('stops processing a script on error', function(done) {
            var first_response = {data: 'text'};
            var first = 'http://testing';

            var mock_first = nock(first)
                .get('/1', '')
                .reply(200, first_response);

            var second = 'http://second';

            var mock_second = nock(second)
                .post('/', first_response)
                .reply(500);
            
            // don't mock this, it will not be called
            var third = 'http://third/';

            request(server.app)
                .post('/')
                .set('Content-Type', 'text/plain')
                .send('GET ' + first + '/1' + ' > POST ' + second + '/' + ' PUT ' + third)
                .expect(400, done);
        });
    
        it('splits requests', function(done) {
            var first_response = [{data: 'text'}, {data: 'other'}];
            var first = 'http://testing';

            var mock_first = nock(first)
                .get('/1', '')
                .reply(200, first_response);

            var second = 'http://second';

            var mock_second = nock(second)
                .post('/', {data: 'text'})
                .reply(200, 'result');

            var mock_third = nock(second)
                .post('/', {data: 'other'})
                .reply(200, 'result');

            request(server.app)
                .post('/')
                .set('Content-Type', 'text/plain')
                .send('GET ' + first + '/1 / ' + ' POST ' + second + '/')
                .expect(200, done);
        });

        it('sends payload to next endpoint', function(done) {
            var payload = JSON.stringify({name : "Zebedee"});
            var endpoint = 'http://accounts.net';

            var mock = nock(endpoint)
                .post('/', payload)
                .reply(200, 'result');

            request(server.app)
                .post('/')
                .set('Content-Type', 'text/plain')
                .send(payload + ' > POST ' + endpoint + '/')
                .expect(200, done);
        });
    });
});

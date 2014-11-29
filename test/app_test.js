var app = require('../src/index'),
  http = require('support/http');

describe('Glue',function(){

  before(function(done){
    http.createServer(app,done);
  });

  it('GET / should return 200',function(done){
    request()
      .get('/')
      .expect(200,done);
  });

  it('POST / should return 200',function(done){
    request()
      .post('/')
      .set('Content-Type','application/json')
      .expect(200,done);
  });
});

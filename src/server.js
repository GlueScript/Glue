/*
 * Configure request body handling
 * Set up routing - the app supports GET / and POST /
 */
var app = require('express')(),
    bodyParser = require('body-parser'),
    routes = require('./routes');

// only expect text/* cotent types, in fact text/plain
// extended to accept an array of scripts sent as json
app.use(bodyParser.text({type : 'text/*', limit: '1024kb'}));

exports.start = function(){
    app.use('/', routes);
};

exports.app = app;

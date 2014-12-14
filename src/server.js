/*
 * Configure request body handling
 * Set up routing - the app supports GET / and POST /
 */
var app = require('express')(),
    bodyParser = require('body-parser'),
    routes = require('./routes');

// only expect text/* cotent types, in fact text/plain
app.use(bodyParser.text({type : 'text/*', limit: '1024kb'}));
// extended to accept an array of scripts

exports.start = function(port){
    app.use('/', routes);
    app.listen(port);
};

exports.app = app;

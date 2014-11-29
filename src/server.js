/*
 * Configure request body handling
 * Set up routing - the app supports GET / and POST /
 */
var app = require('express')(),
    bodyParser = require('body-parser'),
    routes = require('./routes');

app.use(bodyParser.text({type : 'text/*', limit: '1024kb'}));
app.use(bodyParser.text({type : 'application/xml'}));
app.use(bodyParser.json({type : 'application/json'}));

exports.start = function(port){
    app.use('/', routes);
    app.listen(port);
};

exports.app = app;

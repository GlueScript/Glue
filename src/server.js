/*
 * Entry point for the application
 * Initialise logging (all the console)
 * Configure request body handling
 * Set up routing - the app supports GET / and POST /
 */
var app = require('express')(),
    bodyParser = require('body-parser'),
    winston = require('winston'),
    routes = require('./routes');

app.use(bodyParser.text({type : 'text/*', limit: '1024kb'}));
app.use(bodyParser.text({type : 'application/xml'}));
app.use(bodyParser.json({type : 'application/json'}));

exports.start = function(){
    // use env.PORT if set
    var PORT = process.env.PORT || 8781;

    app.use('/', routes);
    app.listen(PORT);

    console.log('info', 'Running on http://localhost:' + PORT);
}

exports.app = app;

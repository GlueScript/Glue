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

/*
* Get winston to log uncaught exceptions and to not exit
*/
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false
});

app.use(bodyParser.text({type : 'text/*', limit: '1024kb'}));
app.use(bodyParser.text({type : 'application/xml'}));
app.use(bodyParser.json({type : 'application/json'}));

// use env.PORT if set
var PORT = 8781;

app.use('/', routes);
app.listen(PORT);

logger.log('info', 'Running on http://localhost:' + PORT);

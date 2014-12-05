/*
 * Entry point for the application
 * Initialise logging (all the console)
 * start the server
 */
var winston = require('winston'),
    server = require('./server');

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

// use env.PORT if set
var PORT = process.env.PORT || 80;
server.start(PORT);

logger.log('info', 'Running on http://localhost:' + PORT);

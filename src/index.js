/*
 * Entry point for the application
 * start the server
 */
var logger = require('./lib/logger'),
    server = require('./server');

// use env.PORT if set
var PORT = process.env.PORT || 80;
server.start();
server.app.listen(PORT);
logger.log('info', 'Running glue service on http://localhost:' + PORT);

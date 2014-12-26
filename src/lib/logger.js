var winston = require('winston');

/*
* Get winston to log uncaught exceptions and to not exit
*/
module.exports = new (winston.Logger) ({
  transports: [
    new winston.transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false
});

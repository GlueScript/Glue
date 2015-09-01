/**
 * Default config values
 */
var Store = require('./lib/store');

var mongo_host = '127.0.0.1:27017';

if (process.env.MONGODB_PORT_27017_TCP_ADDR && process.env.MONGODB_PORT_27017_TCP_PORT) {
    mongo_host = process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT;
} else if (process.env.MONGO_HOST) {
    mongo_host = process.env.MONGO_HOST;
}

var mongo_db = process.env.MONGO_DB || 'glue';

var mongo_collection = 'executions';

var mongo_url = 'mongodb://' + mongo_host +'/' + mongo_db;

module.exports.getStore = function() {
    if (!module.exports.store) {
         module.exports.store = new Store(
             mongo_url,
             mongo_collection
        );
    }
    return module.exports.store;
}

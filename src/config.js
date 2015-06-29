/**
 * Default config values
 */
var Store = require('./lib/store');

var mongo_host = process.env.MONGO_HOST || process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT;
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

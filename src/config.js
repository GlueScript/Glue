/**
 * Default config values
 */
var Store = require('./lib/store');

var mongo_host = process.env.MONGO_HOST || 'localhost:27017';
var mongo_db = process.env.MONGO_DB || 'glue';
var mongo_collection = 'executions';

module.exports.getStore = function() {
    if (!module.exports.store) {
         module.exports.store = new Store(
            'mongodb://' + mongo_host + '/' + mongo_db,
            mongo_collection
        );
    }
    return module.exports.store;
}

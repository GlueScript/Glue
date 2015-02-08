/**
 * Default config values
 */

module.exports.mongo_host = process.env.MONGO_HOST || 'localhost:27017';
module.exports.mongo_db = process.env.MONGO_DB || 'glue';

var uniqid = require('uniqid'),
    Store = require('./store'),
    Config = require('../config'),
    Script = require('./script');

var store = new Store(
    'mongodb://' + Config.mongo_host + '/' + Config.mongo_db,
    Config.mongo_collection
);

/**
 * Create a Script to be run
 */
var generate = function(body) {
    // generate an id for script
    var script = new Script(body);

    store.add(script.id, script, function(err, doc) {
        if (!err){
            console.log('Script Builder generate success: ' + JSON.stringify(doc));
        } else {
            console.log('Script Builder generate error: ' + err);
        }
    });
        
    return script;
};

/**
 * load a stored script from its id string
 */
var load = function(id) {

};

/**
 * save the running state till a later callback to restart
 */
var save = function(script) {

};

module.exports.generate = generate;

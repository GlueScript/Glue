var uniqid = require('uniqid'),
    Store = require('./store'),
    Config = require('../config');

var store = new Store(
    'mongodb://' + Config.mongo_host + '/' + Config.mongo_db,
    Config.mongo_collection
);

/**
 * This doesn't need to be instantiatable, could be a regular 'module'
 * Store state in the 'scripts' generated
 *
 * Runs scripts
 * Stores them with a unique id
 */

/**
 * set a raw script string to be run
 */
var generate = function(body) {
    // generate an id for script
    var script = { body: body, date: new Date(), state: 0, id: uniqid()};

    // store script along with the date/time 
    // new to store the state somehow
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

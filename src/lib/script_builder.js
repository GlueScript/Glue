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
var generate = function(script) {
    // generate an id for script
    var id = uniqid();
    // store script along with the date/time 
    // new to store the state somehow
    store.add(id, {body: script, date: new Date(), state: 0, id: id}, function(err, doc) {
        if (!err){
            //that.script = doc.script;
        } else {
            console.log('Script Builder db error ' + err);
        }
    });
        
    return id;
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

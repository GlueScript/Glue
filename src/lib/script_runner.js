var uniqid = require('uniqid');

/**
 * This doesn't need to be instantiatable, could be a regular 'module'
 * Store state in the 'scripts' generated
 *
 * Runs scripts
 * Stores them with a unique id
 */

function ScriptRunner(store) {
    this.store = store;
    this.script = null;
};

/**
 * set a raw script string to be run
 */
ScriptRunner.prototype.generate = function(script) {
    // generate an id for script
    var id = uniqid();
    // store script along with the date/time 
    this.script = script;
    // new to store the state somehow
    var that = this;
    this.store.add(id, {script: this.script, date: new Date(), state: 'new'}, function(err, doc) {
        if (!err){
            that.script = doc.script;
        } else {
            console.log('Script Runner db error ' + err);
        }
    });
        
    return id;
};

/**
 * load a stored script from its id string
 */
ScriptRunner.prototype.loadScript = function(id) {

};

/**
 * save the running state till a later callback to restart
 */
ScriptRunner.prototype.storeScript = function() {

};
module.exports = ScriptRunner;

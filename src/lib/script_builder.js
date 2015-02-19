var uniqid = require('uniqid');

/**
 * This doesn't need to be instantiatable, could be a regular 'module'
 * Store state in the 'scripts' generated
 *
 * Runs scripts
 * Stores them with a unique id
 */

function ScriptBuilder(store) {
    this.store = store;
    this.script = null;
};

/**
 * set a raw script string to be run
 */
ScriptBuilder.prototype.generate = function(script) {
    // generate an id for script
    var id = uniqid();
    // store script along with the date/time 
    this.script = script;
    // new to store the state somehow
    var that = this;
    this.store.add(id, {body: this.script, date: new Date(), state: 0, id: id}, function(err, doc) {
        if (!err){
            that.script = doc.script;
        } else {
            console.log('Script Builder db error ' + err);
        }
    });
        
    return id;
};

/**
 * load a stored script from its id string
 */
ScriptBuilder.prototype.load = function(id) {

};

/**
 * save the running state till a later callback to restart
 */
ScriptBuilder.prototype.save = function() {

};
module.exports = ScriptBuilder;

var uniqid = require('uniqid');

/**
 * Runs scripts
 * Stores them with a unique id
 */

function ScriptRunner() {
    
};

/**
 * Is this the best function name?
 */
ScriptRunner.prototype.newScript = function(script) {
    // generate an id for script
    var id = uniqid();
    console.log(id);
    return id;
};

ScriptRunner.prototype.loadScript = function(id) {

};

module.exports = ScriptRunner;

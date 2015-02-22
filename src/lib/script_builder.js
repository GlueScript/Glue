var Script = require('./script');

(function() {

    var builder = {};
    builder.store = null;

    builder.init = function(store) {
        builder.store = store;
    };

    /**
    * Create a Script to be run
    */
    builder.generate = function(body) {
         // generate an id for script
         var script = new Script(body);

        builder.store.add(script.id, script, function(err, doc) {
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
    builder.load = function(id) {

    };

    /**
    * save the running state till a later callback to restart
    */
    builder.save = function(script) {

    };

    module.exports = builder;

})();


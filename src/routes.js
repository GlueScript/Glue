var express = require('express'),
    Tokenizer = require('./lib/tokenizer'),
    Parser = require('./lib/parser'),
    Executor = require('./lib/executor');

module.exports = (function() {
    'use strict';
    var routes = express.Router();

    routes.get('/', function (req, res) {
        res.json({
            name : 'Glue', 
            description : "Sticky scripting for HTTP"
        });
    });

    /**
     * Use request Accept header to version this api
     */
    routes.post('/', function(req, res) {
        // accept a script in the body of the request
        // use ScriptBuilder to generate a Script
        // pass Script to Executor constructor or start method along with current Payload = ''
        var exe = new Executor(new Parser(new Tokenizer(req.body)));
        exe.start(function(err, result) {
            // if error is set return a 400 response with result.content
            // result will be a Payload, use it's type to set content-type of response
            res.set({'Content-Type' : result.type});
            if (err) {
               res.status(400).send(result.content);
            } else {
               res.status(200).send(result.content);
            }
        });
    });
    return routes;
})();


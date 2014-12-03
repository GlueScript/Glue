var express = require('express'),
    Parser = require('./lib/parser'),
    Exe = require('./lib/exe');

module.exports = (function() {
    'use strict';
    var routes = express.Router();

    routes.get('/', function (req, res) {
        res.json({
            name : 'Glue', 
            description : "Sticky scripting for services"
        });
    });

    routes.post('/', function(req, res) {
        // accept a script in the body of the request
        var parser = new Parser(req.body);

        // pass callback to write to response.json()
        var exe = new Exe(parser, function(result) {
            res.json(
                {result: result}
            );
        });
        exe.start();
    });

    return routes;
})();


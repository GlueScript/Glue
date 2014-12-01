var express = require('express'),
    Parser = require('./lib/parser'),
    Exe = require('./lib/exe');

module.exports = (function() {
    'use strict';
    var routes = express.Router();

    routes.get('/', function (req, res) {
        res.json({
            name : 'Glue', 
            description : "Scripting for services"
        });
    });

    routes.post('/', function(req, res) {
        // accept a script in the body of the request
        var parser = new Parser(req.body);
        var exe = new Exe(parser, res);
        // pass response to Exe to write to
        exe.run();
    });

    return routes;
})();


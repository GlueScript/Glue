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
        // should pass callback to start() method no constructor?
        var exe = new Exe(parser, function(error, result) {
            // if error is set return a 400 response with result.content
            // result will be a Payload, use it's type to set content-type of response
            res.set({'Content-Type' : result.type});
            if (error) {
               res.status(400).send(result.content);
            } else {
               res.status(200).send(result.content);
            }
        });
        exe.start();
    });

    return routes;
})();


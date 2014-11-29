var express = require('express');

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
        var body = req.body;
    });

    return routes;
})();


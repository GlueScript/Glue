var DOMParser = require('xmldom').DOMParser;

var isJSON = function (content) {
    try {
        JSON.parse(content);
        return true; 
    } catch (e) {
        return false;
    }
}

var detect = function (content) {
    if (isJSON(content)) {
        return 'application/json';
    }

    try {
        // pass in stub error callbacks to suppress error logging
        var doc = new DOMParser({
            locator: {},
            errorHandler: {
                error: function() {},
                fatalError: function() {}
            }
        }).parseFromString(content);

        var documentElement = (doc ? doc.ownerDocument || doc : 0).documentElement;
        if (documentElement) {
            var name = documentElement.nodeName.toLowerCase();
            if ('html' === name) {
                return 'text/html';
            } else {
                return 'application/xml';
            }
        }
    } catch (e) {
    }
    return 'text/plain';
}

exports.isJSON = isJSON;
exports.detect = detect;

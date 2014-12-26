var DOMParser = require('xmldom').DOMParser,
    _ = require('underscore');
_.str = require('underscore.string');

/*
 * Contains a request payload
 * Has content and type
 * Converts Object and Array content to JSON strings
*/
function Payload(content, type) {
    var default_type = type;
    if (_.isArray(content)) {
        var real = [];
        for (var item in content) {
            if (isJSON(content[item])) {
                real.push(JSON.parse(content[item]));
            } else {
                real.push(content[item]);
            }
        }
        content = JSON.stringify(real);
        default_type = 'application/json';
    } else if (_.isObject(content) ) {
        content = JSON.stringify(content);
        default_type = 'application/json';
    } else {
        if (isJSON(content)) {
            default_type = 'application/json';
        } else {
            default_type = getContentType(content);
        }
    }
    
    type = type || default_type;
    type = _.str.words(type, ';')[0];

    Object.defineProperty(this, 'content', {
        writable: false,
        configurable: false,
        enumerable: true,
        value: content
    });

    // trim type, remove everything after the semi-colon eg. '; charset=utf-8'
    Object.defineProperty(this, 'type', {
        writable: false,
        configurable: false,
        enumerable: true,
        value: type 
    });

    Object.defineProperty(this, 'value', {
        get: function() {
            if ('application/json' === type) {
                return JSON.parse(content);
            }
            return content;
        }
    });
}

Payload.prototype.split = function() {
    var items = [];
    if (isJSON(this.content)) {
        var json = JSON.parse(this.content);
        if (_.isArray(json)) {
            for(var item in json) {
                items.push(new Payload(json[item]));
            }
        } else {
            items.push(new Payload(this.content));
        }
    } else {
        items.push(new Payload(this.content));
    }
    return items;
};

function isJSON(content) {
    try {
        JSON.parse(content);
        return true; 
    } catch (e) {
        return false;
    }
}

function getContentType(content) {
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

module.exports = Payload;

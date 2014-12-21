var DOMParser = require('xmldom').DOMParser,
    _ = require('underscore');
_.str = require('underscore.string');

/*
 * Contains a request payload
 * Has content and type
 * Converts Object and Array content to JSON strings
*/
function Payload(content, type) {
    if (_.isArray(content)) {
        var real = [];
        for (var item in content) {
            if (isJSON(content[item])){
                real.push(JSON.parse(content[item]));
            } else {
                real.push(content[item]);
            }
        }
        this.content = JSON.stringify(real);
        this.type = type || 'application/json';
        // attempt to convert each item to a 
    } else if (_.isObject(content) ) {
        this.content = JSON.stringify(content);
        this.type = type || 'application/json';
    } else {
        this.content = content;
        if (isJSON(content)) {
            this.type = type || 'application/json';
        } else {
            this.type = type || getContentType(this.content);
        }
    }
    // trim type, remove everything after the ; eg. '; charset=utf-8'
    this.type = _.str.words(this.type, ';')[0];

}

Payload.prototype.split = function() {
    var items = [];
    if (isJSON(this.content)){
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

Payload.prototype.value = function() {
    if ('application/json' === this.type){
        return JSON.parse(this.content);
    }
    return this.content;
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
                error: function(){},
                fatalError: function(){}
            }
        }).parseFromString(content);

        var documentElement = (doc ? doc.ownerDocument || doc : 0).documentElement;
        if (documentElement) {
            var name = documentElement.nodeName.toLowerCase();
            if ('html' === name){
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

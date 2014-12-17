var DOMParser = require('xmldom').DOMParser;

/*
 * Contains a request payload
 * Has content and type
 * Converts Object and Array content to JSON strings
*/
function Payload(content, type) {
    if (content instanceof Array) {
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
    } else if (content instanceof Object) {
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
}

Payload.prototype.split = function() {
    var items = [];
    if (isJSON(this.content)){
        var json = JSON.parse(this.content);
        if (json instanceof Array) {
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

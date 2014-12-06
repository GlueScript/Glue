var Parser = require('xmldom').DOMParser;

/*
 * Contains a request payload
 * Has content and type
 * Converts Object and Array content to JSON strings
*/
function Payload(content, type) {
    if (content instanceof Object) {
        this.content = JSON.stringify(content);
        this.type = 'application/json';
    } else {
        this.content = content;
        if (isJSON(content)) {
            this.type = 'application/json';
        } else {
            this.type = getContentType(this.content);
        }
    }
}

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
        var doc = new Parser().parseFromString(content);
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

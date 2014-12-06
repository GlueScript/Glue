/*
 * Contains a request payload
 * Has content and type
*/

function Payload(content, type) {
    if (content instanceof Object) {
        this.content = JSON.stringify(content);
        this.type = 'application/json';
    } else {
        this.content = content;
        // now figure out type
        if (isJSON(content)){
            this.type = 'application/json';
        } else {
            this.type = 'text/plain';
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

function isXML(content) {

}
module.exports = Payload;

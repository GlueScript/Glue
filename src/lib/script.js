var uniqid = require('uniqid'),
    Tokenizer = require('./tokenizer'),
    Parser = require('./parser');

/**
 * All properties should be internal
 */
function Script(body, id, state, date) {

    Object.defineProperty(this, 'body', {
        writable: false,
        configurable: false,
        enumerable: true,
        value: body || ''
    });

    Object.defineProperty(this, 'id', {
        writable: false,
        configurable: false,
        enumerable: true,
        value: id || uniqid()
    });

    /**
     * State should be internal - it's not needed by clients
     */
    Object.defineProperty(this, 'state', {
        writable: true,
        configurable: false,
        enumerable: true,
        value: state || 0
    });

    Object.defineProperty(this, 'date', {
        writable: false,
        configurable: false,
        enumerable: true,
        value: date || new Date()
    });

    this.parser = new Parser(new Tokenizer(this.body));
    
    /**
     * Return the next command to execute
     */
    this.next = function() {
        var next = this.parser.next();
        // update state here from parser's index function
        this.state = this.parser.index();
        return next;
    };
    
    /**
     * Return the Payload object, 
     * ie. when the first element in the script is a Payload
     */
    this.payload = function() {

    };
};

module.exports = Script;


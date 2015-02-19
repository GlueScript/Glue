var uniqid = require('uniqid');

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
};

module.exports = Script;


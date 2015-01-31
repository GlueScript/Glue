var Tokenizer = require('./tokenizer'),
    _ = require('underscore');

/**
 * Parser implements generating a set of commands from a script
 * It validates the script syntax is correct
 */
function Parser(string) {
    this.tokenizer = new Tokenizer(string);
};

/**
 * Return a command object with a method and uri property
 * Throw exception if script is invalid
 * Should be 'method uri' or 'operator'
 */
Parser.prototype.next = function() {
    if (this.tokenizer.hasMore()) {
        var token = this.tokenizer.next();

        // enforce method followed by uri
        if (token.isMethod()) {
            return {commands: [nextCommand(token, this.tokenizer)]};
        } else if (token.isOperator()) {
            if (token.value == 'split') {
                return commandFactory(null, null, token.value);
            } else if (token.value == 'pipe') {
                // create command from next two tokens 
                token = this.tokenizer.next();
                if (token.isMethod()){
                    return {commands: [nextCommand(token, this.tokenizer)]};
                }
            } else if (token.value == 'join') {
                // if token.value is join then build a list of commands enclosed by ()s
                if (this.tokenizer.next().value != 'start-group') {
                    throw new Error('Invalid script. "start-group" must follow "join"');
                }

                var commands = [], next;

                while (next = this.tokenizer.next()) {
                    if (next.isOperator() && (next.value == 'end-group')) {
                        return {commands: commands};
                    }

                    if (next.isMethod()) {
                        commands.push(nextCommand(next, this.tokenizer));
                    } else {
                        throw new Error('Invalid script. Group must start with "uri" token');
                    }
                }
                throw new Error('Invalid script. "end-group" must end a group of commands');
            } else {
                throw new Error('Invalid script. Expected "split" or "join". Got "' + token.value + '"');
            }

        } else {
            throw new Error('Invalid script. Expected "method" or "operator"');
        }
    }
};

/**
 * method is a Token instance
 */
function nextCommand(method, tokenizer) {
    if (tokenizer.hasMore()) {
        var uri = tokenizer.next();
        // enforce rule that a method is followed by a uri
        if (uri.isUri()) {
            // return a command
            return commandFactory(method.value, uri.value, null);
        } else {
            throw new Error('Invalid script. Expected a "uri" token, got ' + uri.value);
        }
    } else {
        throw new Error('Invalid script. Expected a "uri" token, got nothing.');
    }
};

/**
 * Convert to an all-purpose object factory
 * Pass in an object param
 * Return an object with the same properties that are not writable nor configurable
 * createLockedObject(obj)
 */
function commandFactory(method, uri, operator) {
    
    var command = {};
    Object.defineProperty(command, 'method', {
        writable: false,
        configurable: false,
        enumerable: true,
        value: method
    });

    Object.defineProperty(command, 'uri', {
        writable: false,
        configurable: false,
        enumerable: true,
        value: uri
    });

    Object.defineProperty(command, 'operator', {
        writable: false,
        configurable: false,
        enumerable: true,
        value: operator
    });

    return command;
};

module.exports = Parser;

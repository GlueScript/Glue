var _ = require('underscore'),
    Obj = require('./obj'),
    ContentType = require('./content_type'),
    Payload = require('./payload');

/**
 * Parser implements generating a set of commands from a script
 * It validates the script syntax is correct
 */
function Parser(tokenizer) {
    this.tokenizer = tokenizer;
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
                return Obj.lock({method: null, uri: null, operator: token.value});
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
                throw new Error('Invalid script. Expected "split", "pipe" or "join". Got "' + token.value + '"');
            }
        } else if (!token.isEmpty() && !token.isUri()) {
            var content = token.value;
            // attempt to read payload content from the script
            // keep reading tokens until the next operator
            while(!this.tokenizer.peek().isOperator()){
                content += this.tokenizer.next().value;
            }
            return Obj.lock({method: null, uri: null, operator: null, payload: new Payload(content, ContentType.detect(content))});
        } else {
            throw new Error('Invalid script. Expected "method", "payload" or "operator"');
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
            return Obj.lock({method: method.value, uri: uri.value, operator: null});
        } else {
            throw new Error('Invalid script. Expected a "uri" token, got ' + uri.value);
        }
    } else {
        throw new Error('Invalid script. Expected a "uri" token, got nothing.');
    }
};

module.exports = Parser;

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
}

/**
 * Return a command object with a method and uri property
 * Throw exception if script is invalid
 */
Parser.prototype.next = function() {

    if (this.tokenizer.hasMore()) {

        var token = this.tokenizer.next();

        if (token.isMethod()) {

            return {commands: [nextCommand(token, this.tokenizer)]};

        } else if (token.isOperator()) {

            if (token.value == 'split') {

                return Obj.lock({method: null, uri: null, operator: token.value});

            } else if (token.value == 'pipe') {
                // create command from next two tokens
                return {commands: [nextCommand(this.tokenizer.next(), this.tokenizer)]};

            } else if (token.value == 'join') {

                return joinCommands(this.tokenizer);

            } else {
                throw new Error('Invalid script. Expected "split", "pipe" or "join". Got "' + token.value + '"');
            }

        } else if (!token.isEmpty() && !token.isUri()) {

            return nextPayload(token.value, this.tokenizer);

        } else {

            throw new Error('Invalid script. Expected "method", "payload" or "operator", got ' + token.value);
        }
    }
};

Parser.prototype.index = function() {
    return this.tokenizer.index();
};

/**
 * method is a Token instance
 */
function nextCommand(token, tokenizer) {

    if (!token.isMethod()){
        throw new Error('Invalid script. Expected a method, got ' + token.value);
    }

    var uri = tokenizer.next();

    // enforce rule that a method is followed by a uri
    if (uri.isUri()) {
        // return a command
        return Obj.lock({method: token.value, uri: uri.value, operator: null});
    } else {
        throw new Error('Invalid script. Expected a "uri" token, got ' + uri.value);
    }
}

/**
 * read payload content from the script
 * keep reading tokens until the next operator
 *
 * @param content
 * @param tokenizer
 * @returns {*}
 */
function nextPayload(content, tokenizer) {

    while(!tokenizer.peek().isOperator()){
        content += tokenizer.next().value;
    }

    return Obj.lock({method: null, uri: null, operator: null, payload: new Payload(content, ContentType.detect(content))});
}


/**
 * build a list of commands enclosed by ()s
 *
 * @param tokenizer
 * @returns {{commands: Array}}
 */
function joinCommands(tokenizer) {

    if (tokenizer.next().value != 'start-group') {
        throw new Error('Invalid script. "start-group" must follow "join"');
    }

    var commands = [], next;

    while (next = tokenizer.next()) {

        if (next.isOperator() && (next.value == 'end-group')) {
            return {commands: commands};
        }

        commands.push(nextCommand(next, tokenizer));
    }
}

module.exports = Parser;

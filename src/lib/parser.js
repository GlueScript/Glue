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
 * Should be 'operator uri' or just '/'
 */
Parser.prototype.next = function() {
    if (this.tokenizer.hasMore()){
        var token = this.tokenizer.next();

        // enforce method followed by uri
        if (token.isMethod()){
            return {commands: [nextCommand(token, this.tokenizer)]};
        } else if (token.isOperator()){
            if (token.getValue() == 'split'){
                return {operator : token.getValue()}; 
            } else if (token.getValue() == 'join') {
                // if token.value is join then build a list of commands enclosed by ()s
                if (this.tokenizer.next().getValue() != 'start-group'){
                    throw new Error('Invalid script. Start-group must follow join');
                }

                var commands = [], next;

                while (next = this.tokenizer.next()){
                    if (next.isOperator() && (next.getValue() == 'end-group')){
                        return {commands: commands};
                    }

                    if (next.isMethod()){
                        commands.push(nextCommand(next, this.tokenizer));
                    } else {
                        throw new Error('Invalid script. Group must start with a uri');
                    }
                }
                throw new Error('Invalid script. End-group must end a group of commands');
            } else {
                throw new Error('Invalid script. Expected "split" or "join". Got ' + token.getValue());
            }

        } else {
            throw new Error('Invalid script. Expected method or operator');
        }
    }
};

function nextCommand(method, tokenizer) {
    if (tokenizer.hasMore()){
        var uri = tokenizer.next();
        // enforce rule that a method is followed by a uri
        if (uri.isUri()) {
            // return a command
            return {method: method.getValue(), uri: uri.getValue()};
        } else {
            throw new Error('Invalid script. Expected a uri, got ' + uri.getValue());
        }
    } else {
        throw new Error('Invalid script. Expected a uri, got nothing.');
    }
};

module.exports = Parser;

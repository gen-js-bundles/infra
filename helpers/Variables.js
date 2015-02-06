var Variables = (function Variables() {
    var Variables = function() {
        this.variables = [];
        this.scopes = [];
        this.currentVariables = null;
        this.currentScope = null;
    };
    Variables.prototype.set = function(name, type) {
        if(this.currentVariables != null) {
            this.currentVariables[name] = type;
            this.currentScope.variables[name] = type;
        }
    };
    Variables.prototype.get = function(name) {
        if(this.currentVariables[name] == null) {
            return null;
        } else {
            return {
                name: name,
                type: this.currentVariables[name]
            };
        }
    };
    Variables.prototype.newVariables = function() {
        var newVariables = {};
        if(this.currentVariables != null) {
            for (var variableName in this.currentVariables) {
                newVariables[variableName] = this.currentVariables[variableName];
            }
        }
        this.currentVariables = newVariables;
        this.variables.push(newVariables);
    };
    Variables.prototype.enterBlock = function(scopeName) {
        this.currentScope = {
            type: 'block',
            name: scopeName,
            variables: {}
        };
        this.scopes.push(this.currentScope);
        this.newVariables();
    };
    Variables.prototype.enterFunction = function(name) {
        this.currentScope = {
            type: 'function',
            name: scopeName,
            variables: {}
        };
        this.scopes.push(this.currentScope);
        this.newVariables();
    };
    Variables.prototype.exit = function() {
        this.scopes.pop();
        if(this.scopes.length == 0) {
            this.currentScope = null;
        } else {
            this.currentScope = this.scopes[this.scopes.length-1];
        }
        this.variables.pop();
        if(this.variables.length == 0) {
            this.currentVariables = null;
        } else {
            this.currentVariables = this.variables[this.variables.length-1];
        }
    };
    return Variables;
})();

module.exports = Variables;
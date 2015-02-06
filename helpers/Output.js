var _ = require('lodash');

var Output = (function Output() {
    var Output = function() {
        this.init();
    };
    Output.prototype.init = function() {
        this.lines = [];
        this.indent = 0;
    };
    Output.prototype.setIndent = function(indent) {
        this.indent = indent;
    };
    Output.prototype.addIndent = function(indent) {
        this.indent += indent;
        if(indent > 0) {
            for (var i = 0; i < indent; i++) {
                this.lines[this.lines.length - 1] = ' ' + this.lines[this.lines.length - 1];
            }
        }
        if(indent < 0) {
            for (var i = 0; i > indent && this.lines[this.lines.length - 1].length > 0; i--) {
                this.lines[this.lines.length - 1] = this.lines[this.lines.length - 1].substring(1);
            }
        }
    };
    Output.prototype.newLine = function() {
        this.lines.push('');
        for(var i=0; i<this.indent; i++) {
            this.lines[this.lines.length-1] += " ";
        }
    };
    Output.prototype.println = function(content) {
        this.append(content);
        this.newLine();
    };
    Output.prototype.print = function(content) {
        this.append(content);
    };
    Output.prototype.append = function(content) {
        if(this.lines.length == 0) {
            this.newLine();
        }
        this.lines[this.lines.length-1] += content;
    };
    Output.prototype.getAll = function() {
        return this.lines;
    };
    Output.prototype.toString = function() {
        var out = '';
        _.each(this.lines, function(line) {
            out += line + '\n';
        });
        return out;
    };
    return Output;
})();

module.exports = Output;
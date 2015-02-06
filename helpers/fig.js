var _ = require('lodash');
var Shell = require('./shell');
var Output = require('./Output.js');

module.exports = (function Fig() {
    var $this;
    var Fig = function(context) {
        this.context = context;
        this.indent = 0;
        this.hasInstall = false;
        this.installed = [];
        this.shell = new Shell(this.context);
        this.out = new Output();
        $this = this;
    };
    Fig.prototype.fig = function(elt) {
        this.out.init();
        this.out.setIndent(2);
        this.analyze(elt, true);
        var out = this.out.toString();
        return out;
    };
    Fig.prototype.analyze = function(elt, addEndLine) {
        if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                this.analyze(elt2);
            }
        }
        else if(typeof elt === 'string') {
            this.out.println(elt);
        } else {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(eltName2 == 'expose' || eltName2 == 'port') {
                    this.ports(elt2, eltName2);
                    this.expose(elt2, eltName2);
                }
                else if(eltName2 == 'volume') {
                    this.volume(elt2, eltName2);
                }
                else if(eltName2 == 'links') {
                    this.links(elt2, eltName2);
                }
            }
        }
    };
    Fig.prototype.expose = function(elt, eltName) {
        this.out.println('expose:');
        this.out.addIndent(2);
        if(!_.isObject(elt)) {
            if(typeof elt !== 'string' || elt.indexOf(':') == -1) {
                this.out.println('- "' + elt + '"');
            }
        }
        else if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                if(!_.isObject(elt2)) {
                    if(typeof elt2 !== 'string' || elt2.indexOf(':') == -1) {
                        this.out.println('- "' + elt2 + '"');
                    }
                }
            }
        } else {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(elt2 == null) {
                    this.out.println('- ' + eltName2);
                } else {
                    this.out.println('- ' + eltName2 + ':' + elt2);
                }
            }
        }
        this.out.addIndent(-2);
    };
    Fig.prototype.ports = function(elt, eltName) {
        this.out.println('ports:');
        this.out.addIndent(2);
        if(!_.isObject(elt)) {
            if(typeof elt === 'string' && elt.indexOf(':') != -1) {
                var port2 = elt.substring(elt.indexOf(':') + 1);
                if(port2 == null || port2.trim() == '') {
                    var port = elt.substring(0, elt.indexOf(':'));
                } else {
                    var port = elt;
                }
                this.out.println('- "' + port + '"');
            }
        }
        else if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                if(!_.isObject(elt2)) {
                    if(typeof elt2 === 'string' && elt2.indexOf(':') != -1) {
                        var port2 = elt2.substring(elt2.indexOf(':') + 1);
                        if(port2 == null || port2.trim() == '') {
                            var port = elt2.substring(0, elt2.indexOf(':'));
                        } else {
                            var port = elt2;
                        }
                        this.out.println('- "' + port + '"');
                    }
                } else {
                    for(var eltName3 in elt2) {
                        var elt3 = elt2[eltName3];
                        if(elt3 == null) {
                            this.out.println('- "' + eltName3 + '"');
                        } else {
                            this.out.println('- "' + eltName3 + ':' + elt3 + '"');
                        }
                    }
                }
            }
        } else {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(elt2 == null) {
                    this.out.println('- ' + eltName2);
                } else {
                    this.out.println('- ' + eltName2 + ':' + elt2);
                }
            }
        }
        this.out.addIndent(-2);
    };
    Fig.prototype.volume = function(elt, eltName) {
        this.out.println('volumes:');
        this.out.addIndent(2);
        if(typeof elt === 'string') {
            this.out.println('- ' + elt);
        }
        else if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                if(!_.isObject(elt2)) {
                    this.out.println('- ' + elt2);
                } else {
                    for(var eltName3 in elt2) {
                        var elt3 = elt2[eltName3];
                        if(elt3 == null) {
                            this.out.println('- ' + eltName3);
                        } else {
                            this.out.println('- ' + eltName3 + ':' + elt3);
                        }
                    }
                }
            }
        }
        else {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(elt2 == null) {
                    this.out.println('- ' + eltName2);
                } else {
                    this.out.println('- ' + eltName2 + ':' + elt2);
                }
            }
        }
        this.out.addIndent(-2);
    };
    Fig.prototype.links = function(elt, eltName) {
        this.out.println('links:');
        this.out.addIndent(2);
        if(typeof elt === 'string') {
            this.out.println('- ' + elt);
        }
        else if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                if(!_.isObject(elt2)) {
                    this.out.println('- ' + elt2);
                } else {
                    for(var eltName3 in elt2) {
                        var elt3 = elt2[eltName3];
                        if(elt3 == null) {
                            this.out.println('- ' + eltName3);
                        } else {
                            this.out.println('- ' + eltName3 + ':' + elt3);
                        }
                    }
                }
            }
        }
        else {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(elt2 == null) {
                    this.out.println('- ' + eltName2);
                } else {
                    this.out.println('- ' + eltName2 + ':' + elt2);
                }
            }
        }
        this.out.addIndent(-2);
    };
    return Fig;
})();
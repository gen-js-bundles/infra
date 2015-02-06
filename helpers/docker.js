var _ = require('lodash');
var Shell = require('./shell');
var Output = require('./Output.js');

module.exports = (function Docker() {
    var $this;
    var Docker = function(context) {
        this.context = context;
        this.indent = 0;
        this.hasInstall = false;
        this.installed = [];
        this.shell = new Shell(this.context);
        this.out = new Output();
        $this = this;
    };
    Docker.prototype.docker = function(elt) {
        this.analyze(elt, true);
        var out = this.out.toString();
        return out;
    };
    Docker.prototype.analyze = function(elt, addEndLine) {
        if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                if(addEndLine) {
                    this.out.newLine();
                }
                this.analyze(elt2);
            }
        }
        else if(typeof elt === 'string') {
            if(addEndLine) {
                this.out.newLine();
            }
            this.out.println(elt);
        } else {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(addEndLine) {
                    this.out.newLine();
                }
                if(eltName2 == 'from') {
                    this.from(elt2, eltName2);
                }
                else if(eltName2 == 'run') {
                    this.run(elt2, eltName2);
                }
                else if(eltName2 == 'expose' || eltName2 == 'port') {
                    this.expose(elt2, eltName2);
                }
                else if(eltName2 == 'volume') {
                    this.volume(elt2, eltName2);
                }
                else if(eltName2 == 'cmd') {
                    this.cmd(elt2, eltName2);
                }
            }
        }
    };
    Docker.prototype.from = function(elt, eltName) {
        if(typeof elt === 'string') {
            this.out.println('FROM ' + elt + ':latest');
        }
        else if(!( elt instanceof Array )) {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if (elt2 == null) {
                    this.out.println('FROM ' + eltName2 + ':latest');
                } else {
                    this.out.println('FROM ' + eltName2 + ':' + elt2);
                }
            }
        }
    };
    Docker.prototype.run = function(elt, eltName) {
        if(typeof elt === 'string') {
            this.out.println('RUN ' + Shell.js(elt));
        }
        else if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                this.shell.analyze(elt[i], false);
                _.each(this.shell.out.getAll(), function(line) {
                    line = line.trim();
                    if(line == null || line == '') {
                        $this.out.newLine();
                    }
                    else if(line[0] == '#') {
                        $this.out.newLine();
                        $this.out.print(line);
                    }
                    else {
                        $this.out.newLine();
                        $this.out.print('RUN ' + line);
                    }
                });
                this.shell.out.init();
            }
        }
        else {
            this.shell.analyze(elt, false);
            _.each(this.shell.out.getAll(), function(line) {
                line = line.trim();
                if(line == null || line == '') {
                    $this.out.newLine();
                }
                else if(line[0] == '#') {
                    $this.out.newLine();
                    $this.out.print(line);
                }
                else {
                    $this.out.newLine();
                    $this.out.print('RUN ' + line);
                }
            });
            this.shell.out.init();
        }
    };
    Docker.prototype.expose = function(elt, eltName) {
        if(!_.isObject(elt)) {
            this.exposeOne(elt);
        }
        else if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                if(!_.isObject(elt2)) {
                    this.exposeOne(elt2);
                } else {
                    for(var eltName3 in elt2) {
                        this.exposeOne(eltName3);
                    }
                }
            }
        } else {
            for(var eltName2 in elt) {
                this.exposeOne(eltName2);
            }
        }
    };
    Docker.prototype.exposeOne = function(port) {
        if(typeof port === 'string' && port.indexOf(':') != -1) {
            port = port.substring(0,port.indexOf(':'));
        }
        this.out.println('EXPOSE ' + port);
    };
    Docker.prototype.volume = function(elt, eltName) {
        if(typeof elt === 'string') {
            this.volumeOne(elt);
        }
        else if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                if(!_.isObject(elt2)) {
                    this.volumeOne(elt2);
                } else {
                    for(var eltName3 in elt2) {
                        this.volumeOne(eltName3);
                    }
                }
            }
        }else if(!( elt instanceof Array )) {
            for(var eltName2 in elt) {
                this.volumeOne(eltName2);
            }
        }
    };
    Docker.prototype.volumeOne = function(volume) {
        if(typeof volume === 'string' && volume.indexOf(':') != -1) {
            volume = volume.substring(0,volume.indexOf(':'));
        }
        this.out.println('VOLUME ["' + volume + '"]');
    };
    Docker.prototype.cmd = function(elt, eltName) {
        if(!_.isObject(elt)) {
            this.out.println('CMD ' + elt);
        } else {
            this.shell.analyze(elt, false);
            var shell = this.shell.out.toString();
            this.out.println('CMD ' + shell);
        }
    };
    return Docker;
})();
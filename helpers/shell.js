var _ = require('lodash');
var Output = require('./Output.js');
var fs = require('fs');

module.exports = (function Shell() {
    var Shell = function(context) {
        this.context = context;
        this.indent = 0;
        this.hasInstall = false;
        this.installed = [];
        this.out = new Output();
    };
    Shell.prototype.sh = function(elt) {
        this.out = new Output();
        this.analyze(elt, true);
        return this.out.toString();
    };
    Shell.prototype.method = function(methodName, method, indent) {
        this.variables.enterBlock();
        this.out.setIndent(indent);
        this.analyze(method.body, true);
        this.variables.exit();
    };
    Shell.prototype.analyze = function(elt, addEndLine) {
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
            this.out.print(elt);
            if(addEndLine) {
                this.out.print(";");
            }
        } else {
            for(var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(addEndLine) {
                    this.out.newLine();
                }
                if(eltName2 == 'install') {
                    this.install(elt2, eltName2);
                }
                else if(eltName2 == 'apt') {
                    this.apt(elt2, eltName2);
                }
                else {
                    this.out.print(eltName2);
                    this.analyze(elt2);
                }
            }
        }
    };
    Shell.prototype.install = function(elt, eltName) {
        if (typeof elt === 'string') {
            this.installOne(elt, elt);
        }
        else if (elt instanceof Array) {
            for (var i=0; i<elt.length; i++) {
                var elt2 = elt[i];
                if(typeof elt2 === 'string') {
                    this.installOne(elt2, elt2);
                } else {
                    for(var eltName3 in elt2) {
                        var elt3 = elt2[eltName3];
                        this.installOne(elt3, eltName3);
                    }
                }
            }
        } else {
            for (var eltName2 in elt) {
                var elt2 = elt[eltName2];
                this.installOne(elt2, eltName2);
            }
        }
    };
    Shell.prototype.installOne = function(elt, eltName) {
        if (_.includes(this.installed, eltName)) {
            return;
        } else {
            this.installed.push(eltName);
        }
        if (!this.hasInstall) {
            this.hasInstall = true;
            this.out.println(this.read('update.sh'));
            this.out.newLine();
        }
        if (eltName === 'python-software-properties') {
            this.out.println(this.read('python-software-properties.sh'));
        }
        else if(eltName === 'docker') {
            this.installOne('curl', 'curl');
            this.out.println(this.read('docker.sh'));
        }
        else if(eltName === 'docker-compose') {
            this.installOne('docker', 'docker');
            this.out.println(this.read('docker-compose.sh'));
        }
        else if(eltName === 'java') {
            var data = {};
            if(elt == '1.6' || elt == '1.7' || elt == '1.8') {
                data.version = elt;
            } else {
                data.version = '1.8';
            }
            this.installOne('python-software-properties', 'python-software-properties');
            this.out.println(this.read('java.sh', data));
        }
        else if(eltName === 'tomcat') {
            this.installOne('java', 'java');
            this.installOne('wget', 'wget');
            var data = {};
            if(elt != null && elt != 'tomcat') {
                if(typeof elt == 'string' && elt.indexOf('.')) {
                    data.TOMCAT_MAJOR_VERSION = elt.substring(0, elt.substring(0,elt.indexOf('.')));
                } else {
                    data.TOMCAT_MAJOR_VERSION = elt;
                }
                data.TOMCAT_MINOR_VERSION = elt;
            } else {
                data.TOMCAT_MAJOR_VERSION = '8';
                data.TOMCAT_MINOR_VERSION = '8.0.11';
            };
            this.out.println(this.read('tomcat.sh', data));
        }
        else if(eltName === 'maven') {
            this.installOne('java', 'java');
            this.out.println(this.read('maven.sh'));
        }
        else if(eltName === 'apache2') {
            this.out.println(this.read('apache2.sh'));
        }
        else if(eltName === 'jenkins') {
            this.installOne('apache2', 'apache2');
            this.installOne('java', 'java');
            this.out.println(this.read('jenkins.sh'));
        }
        else if(eltName === 'mongodb') {
            var data = {};
            if(elt != null && elt != 'mongodb') {
                data.version = elt;
            } else {
                data.version = '2.6.1';
            }
            this.out.println(this.read('mongodb.sh', data));
        }
        else if(eltName === 'node' || eltName === 'nodejs') {
            this.installed.push('node');
            this.installed.push('nodejs');
            this.installOne('python-software-properties', 'python-software-properties');
            this.out.println(this.read('nodejs.sh'));
        }
        else if(eltName === 'yo' || eltName === 'yeoman') {
            this.installed.push('yo');
            this.installed.push('yeoman');
            this.installOne('nodejs', 'nodejs');
            this.installOne('grunt', 'grunt');
            this.installOne('bower', 'bower');
            this.out.println(this.read('yeoman.sh'));
        }
        else if(eltName === 'grunt' || eltName === 'grunt-cli') {
            this.installed.push('grunt');
            this.installed.push('grunt-cli');
            this.installOne('nodejs', 'nodejs');
            this.out.println(this.read('grunt-cli.sh'));
        }
        else if(eltName === 'bower') {
            this.installOne('nodejs', 'nodejs');
            this.out.println(this.read('bower.sh'));
        }
        else if(eltName === 'ruby') {
            this.out.println(this.read('ruby.sh'));
        }
        else {
            this.out.println('sudo apt-get install -y ' + eltName);
        }
        this.out.newLine();
    };
    Shell.prototype.apt = function(elt, eltName) {
        if(typeof elt === 'string') {
            this.out.println('sudo apt-get ' + elt);
        }
        else if(elt instanceof Array) {
            for(var i=0; i<elt.length; i++) {
                this.apt(elt[i], eltName);
                this.out.newLine();
            }
        } else {
            for (var eltName2 in elt) {
                var elt2 = elt[eltName2];
                if(eltName2 === 'install') {
                    this.out.print('sudo apt-get install -y');
                    if(elt2 instanceof Array) {
                        for(var i=0; i<elt2.length; i++) {
                            this.out.print(' ' + elt2[i]);
                        }
                    } else {
                        for(var elt3Name in elt2) {
                            this.out.print(' ' + elt3Name);
                        }
                    }
                }
                if(eltName2 === 'purge') {
                    this.out.print('sudo apt-get purge -y');
                    if(elt2 instanceof Array) {
                        for(var i=0; i<elt2.length; i++) {
                            this.out.print(' ' + elt2[i]);
                        }
                    } else {
                        for(var elt3Name in elt2) {
                            this.out.print(' ' + elt3Name);
                        }
                    }
                }
                this.out.newLine();
            }
        }
    };
    Shell.prototype.read = function(file, data) {
        try {
            return this.context.render('./bundles/infra/install/' + file, null, null, null, data);
        } catch(e) {
            console.log('Error : reading file : ', './bundles/infra/install/' + file, e);
        }
    };
    return Shell;
})();

var
  inquirer = require("inquirer"),
  fs = require('fs'),
  path = require('path'),
  gfile = require('gfilesync'),
  yaml = require('js-yaml');

module.exports = {
  do: function(data, callback) {

    var questions = [
      {
        type: 'checkbox',
        name: 'install',
        message: 'Which program to install in the VM ?',
        choices: [{
          name: 'nano',
          value: 'nano',
          checked: true
        },{
          name: 'locate',
          value: 'locate',
          checked: true
        },{
          name: 'docker',
          value: 'docker',
          checked: true
        },{
          name: 'docker-compose',
          value: 'docker-compose',
          checked: true
        }]
      },
      {
        type: 'input',
        name: 'ip',
        message: 'IP Address',
        default: '192.168.32.10'
      },
      {
        type: 'input',
        name: 'memory',
        message: 'RAM Memory',
        default: '1536'
      }
    ];
    inquirer.prompt(questions, function( answers ) {

      var data = gfile.loadYaml(path.join(process.cwd(),'Genjsfile.yml'));

      if(data.global == null) {
        data.global = {};
      }
      if(data.global.project == null) {
        data.global.project = {};
      }
      if(data.global.project.name == null) {
        data.global.project.name = 'myapp';
      }
      if(data.global.project.version == null) {
        data.global.project.version = '0.1';
      }
      if(data.global.project.description == null) {
        data.global.project.description = '';
      }

      gfile.writeYaml(path.join(process.cwd(),'Genjsfile.yml'), data);

      var data = {
      	ip: answers.ip,
        memory: answers.memory
      };

      gfile.writeYaml(path.join(process.cwd(),'model','server.yml'), data);
      
      var data = {
        sh: [{
          install: answers.install
        }]
      };
      
      gfile.writeYaml(path.join(process.cwd(),'model','server.@vagrant.yml'), data);

      if(callback) {
        callback();
      }
    });
  }
};

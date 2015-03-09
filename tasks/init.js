var
  inquirer = require("inquirer"),
  fs = require('fs'),
  path = require('path'),
  gfile = require('gfilesync'),
  yaml = require('js-yaml'),
  mkdirp = require('mkdirp');

module.exports = {
  do: function(data, callback) {

    var questions = [
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

      mkdirp.sync(path.join(process.cwd(),'model','@vagrant'));
      gfile.writeYaml(path.join(process.cwd(),'model','@vagrant','server.yml'), data);

      if(callback) {
        callback();
      }
    });
  }
};

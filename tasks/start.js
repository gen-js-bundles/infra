var
  inquirer = require("inquirer"),
  fs = require('fs'),
  path = require('path'),
  exec = require('child_process').exec;

module.exports = {
  do: function(data, callback) {
    // Start
    var questions = [
      {
        type: 'confirm',
        name: 'start',
        message: 'Start the server with Vagrant and VirtualBox ?',
        default: true
      }
    ];
    inquirer.prompt(questions, function( answers ) {

      if(answers.start) {
        console.log('start');
        // console.log(data);
        // console.log(data.Genjsfile);
        var outPath = path.join(process.cwd(),data.Genjsfile.config.outDir);

        data.cli.exec('vagrant up', {cwd: outPath})
          .then(function() {
              var deferred = q.deferred();
              var questions = [
                {
                  type: 'confirm',
                  name: 'ssh',
                  message: 'Connect to the server by SSH with `vagrant ssh` ?',
                  default: true
                }
              ];
              inquirer.prompt(questions, function( answers ) {
                if(answers.ssh) {
                  return data.cli.exec('vagrant ssh', {cwd: outPath});
                } else {
                  deferred.resolve();
                }
              }
              return deferred;
          })
          .then(function() {
            if(callback) {
              callback();
            }
          });
      }

    });
  }
};

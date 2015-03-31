var
  inquirer = require("inquirer"),
  chalk = require('chalk'),
  Q = require('q'),
  fs = require('fs'),
  path = require('path'),
  gfile = require('gfilesync'),
  mkdirp = require('mkdirp'),
  yaml = require('js-yaml'),
  GenJS = require('genjs');

var Task = (function() {
  function Task() {
  }
  Task.prototype.do = function(data, callback) {
    this.doMain(data, callback);
  };
  Task.prototype.getEntities = function() {
    var entities = {};
    for(var entityId in this.genJS.entities) {
      var entity = this.genJS.entities[entityId];
      if(this.hasTagDocker(entity)) {
        entities[entityId] = entity;
      }
    }
    return entities;
  };
  Task.prototype.hasTagDocker = function(entity) {
    for(var tagId in entity.tags) {
      if(tagId == 'docker') {
        if(entity.tags != null && entity.tags.docker != null) {
          return true;
        }
      }
    }
    return false;
  };
  Task.prototype.loadGenJS = function(data) {
    this.genJS = new GenJS(data.Genjsfile);
    this.genJS.load();
  };
  Task.prototype.cleanEntity = function(entity) {
    var entityClean = {
      tags: {
        docker: {}
      }
    };
    for(var eltId in entity.tags.docker) {
      if(eltId != 'id') {
        entityClean.tags.docker[eltId] = entity.tags.docker[eltId];
      }
    }
    return entityClean;
  };
  Task.prototype.writeEntities = function(entities) {
    for(var entityId in entities) {
      var entity = entities[entityId];
      this.writeEntity(entity);
    }
  };
  Task.prototype.writeEntity = function(entity) {
    var entityToSave = this.cleanEntity(entity);
    var modelDir = this.genJS.modelDirs[0];
    mkdirp.sync(path.join(modelDir, '@docker'));
    gfile.writeYaml(path.join(modelDir, '@docker', entity.id + '.yml'), entityToSave);
  };
  Task.prototype.deleteEntity = function(entity) {
    var modelDir = this.genJS.modelDirs[0];
    fs.unlinkSync(path.join(modelDir,'@docker',entity.id+'.yml'));
  };
  Task.prototype.showEntities = function(entities) {
    console.log('');
    for (var entityId in entities) {
      var entity = entities[entityId];
      entity.id = entityId;
      this.showOneEntity(entity);
    }
  };
  Task.prototype.showEntity = function(entity) {
    console.log('');
    this.showOneEntity(entity);
  };
  Task.prototype.showOneEntity = function(entity) {
    console.log(entity.id,':');
    var docker = entity.tags.docker;
    for(var eltId in docker) {
      if(eltId == 'id') {
        continue;
      }
      if(eltId == 'expose') {
        console.log('  expose:');
        for(var i=0; i<docker.expose.length; i++) {
          var expose = docker.expose[i];
          if(typeof expose == 'string' || typeof expose == 'number') {
            console.log('    container port: ' + expose);
          }
          else {
            for(var exposeEltId in expose) {
              console.log('    container port: ' + expose[exposeEltId] + ' -> host port: ' + exposeEltId);
            }
          }
        }
      }
      else {
        if (docker[eltId] instanceof Array) {
          console.log('  ' + eltId, ':');
          for (var i = 0; i < docker[eltId].length; i++) {
            console.log('    - ' + docker[eltId][i]);
          }
        }
        else if (typeof docker[eltId] == 'string') {
          console.log('  ' + eltId, ':', docker[eltId]);
        }
        else {
          console.log('  ' + eltId, ':');
          for (var elt2Id in docker[eltId]) {
            console.log('    ' + elt2Id, ':', docker[eltId][elt2Id]);
          }
        }
      }
    }
    console.log('');
  };
  Task.prototype.doMain = function(data, callback) {
    this.loadGenJS(data);
    var choices = [];
    var entities = this.getEntities();
    this.showEntities(entities);
    choices.push({
      name: 'Exit',
      value: null
    });
    choices.push(new inquirer.Separator());
    choices.push({
      name: 'Add entity',
      value: 'add'
    });
    if(entities != null && Object.keys(entities).length > 0) {
      choices.push({
        name: 'Remove entity',
        value: 'remove'
      });
      choices.push(new inquirer.Separator());
      var entities = this.getEntities();
      for (var entityId in entities) {
        var entity = entities[entityId];
        choices.push({
          value: entity,
          name: entity.name,
          checked: false
        });
      }
    }
    var questions = [
      {
        type: 'list',
        name: 'action',
        message: 'Action',
        choices: choices
      }
    ];
    inquirer.prompt(questions, function( answers ) {
      if(answers.action == 'add') {
        this.doAddEntity(data, function (entity) {
          if(entity == null) {
            this.doMain(data, callback);
          } else {
            this.writeEntity(entity);
            this.doEditEntity(entity, data, function (entity) {
              this.writeEntity(entity);
              this.doMain(data, callback);
            }.bind(this));
          }
        }.bind(this));
      }
      else if(answers.action == 'remove') {
        this.doSelectEntity(data, function (entity) {
          if(entity == null) {
            this.doMain(data, callback);
          } else {
            this.doRemoveEntity(entity, data, function () {
              this.doMain(data, callback);
            }.bind(this))
          }
        }.bind(this));
      }
      else if(answers.action != null) {
        var entity = answers.action;
        this.doEditEntity(entity, data, function (entity) {
          this.writeEntity(entity);
          this.doMain(data, callback);
        }.bind(this));
      }
      if(callback) {
        callback();
      }
    }.bind(this));
  };
  Task.prototype.doAddEntity = function(data, callback) {
    var questions = [
      {
        type: 'input',
        name: 'entityName',
        message: 'Entity name'
      }
    ];
    inquirer.prompt(questions, function( answers ) {
      console.log(answers.entityName);
      if(answers.entityName == null || answers.entityName == '') {
        callback(null);
      } else {
        var entity = {
          id: answers.entityName,
          name: answers.entityName,
          tags: {
            docker: {
            }
          }
        };
        this.writeEntity(entity);
        this.loadGenJS(data);
        callback(entity);
      }
    }.bind(this));
  };
  Task.prototype.doSelectEntity = function(data, callback) {
    var entitiesChoices = [];
    entitiesChoices.push({
      name: 'Exit',
      value: null
    });
    entitiesChoices.push(new inquirer.Separator());
    var entities = this.getEntities();
    for (var entityId in entities) {
      var entity = entities[entityId];
      entitiesChoices.push({
        value: entity,
        name: entity.name,
        checked: false
      });
    }
    var questions = [
      {
        type: 'list',
        name: 'entity',
        message: 'Entity',
        choices: entitiesChoices
      }
    ];
    inquirer.prompt(questions, function( answers ) {
      callback(answers.entity);
    }.bind(this));
  };
  Task.prototype.doRemoveEntity = function(entity, data, callback) {
    if(entity == null) {
      callback();
      return;
    }
    var questions = [
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Confirm remove entity: '+entity.id,
        default: true
      }
    ];
    inquirer.prompt(questions, function( answers ) {
      if(answers.confirm) {
        this.deleteEntity(entity);
      }
      callback();
    }.bind(this));
  };

  Task.prototype.doEditEntity = function(entity, data, callback) {
    if(entity == null) {
      callback();
      return;
    }
    this.loadGenJS(data);
    var entities = this.getEntities();
    entity = entities[entity.id];
    this.showEntity(entity);

    var questions = [
      {
        type: 'input',
        name: 'from',
        message: 'from',
        default: entity.tags.docker.from
      }
    ];
    inquirer.prompt(questions, function( answers ) {
      entity.tags.docker.from = answers.from;
      var docker = entity.tags.docker;

      this.promiseDockerExpose(docker)
        .then(function() {
          callback(entity)
        });
    }.bind(this));
  };

  Task.prototype.promiseDockerExpose = function(docker) {

    var exposeInquirer = (function exposeInquirer(docker) {

      var exposeChoices = [];
      for(var exposeId in docker.expose) {
        var expose = docker.expose[exposeId];
        if(typeof expose == 'string' || typeof expose == 'number') {
          exposeChoices.push({
            name: 'Container port: ' + expose,
            value: exposeId
          })
        }
        else {
          for(var exposeEltId in expose) {
            exposeChoices.push({
              name: 'Container port: ' + expose[exposeEltId] + ' -> Host port: ' + exposeEltId,
              value: exposeId
            })
          }
        }
      }

      var exposeActionChoices = [];
      exposeActionChoices.push({
        name: 'Exit',
        value: null
      });
      exposeActionChoices.push(new inquirer.Separator());
      exposeActionChoices.push(
        {
          name: 'Add expose',
          value: 'add'
        }
      );
      if(exposeChoices.length > 0) {
        exposeActionChoices.push({
          name: 'Remove expose',
          value: 'remove'
        });
        exposeActionChoices.push(new inquirer.Separator());
        for(var i=0; i<exposeChoices.length; i++) {
          exposeActionChoices.push(exposeChoices[i]);
        }
      }

      var exposeRemoveChoices = [];
      exposeRemoveChoices.push({
        name: 'Exit',
        value: null
      });
      exposeRemoveChoices.push(new inquirer.Separator());
      if(exposeChoices.length > 0) {
        for(var i=0; i<exposeChoices.length; i++) {
          exposeRemoveChoices.push(exposeChoices[i]);
        }
      }
      var questions = [
        {
          type: 'list',
          name: 'exposeAction',
          message: 'Expose port action',
          choices: exposeActionChoices
        },
        {
          type: 'list',
          name: 'exposeToRemove',
          message: 'Expose port to remove',
          when: function(answers) {
            return answers.exposeAction == 'remove';
          },
          choices: exposeRemoveChoices
        },
        {
          type: 'input',
          name: 'exposeContainer',
          message: 'Container port',
          when: function(answers) {
            return answers.exposeAction != null && answers.exposeAction !== 'remove' && answers.exposeName != '';
          },
          default: function(answers) {
            if(answers.exposeAction !== 'add') {
              var expose = docker.expose[answers.exposeAction];
              if(typeof expose == 'string' || typeof expose == 'number') {
                return expose;
              }
              else {
                for(var exposeEltId in expose) {
                  return expose[exposeEltId];
                }
              }
            };
          }
        },
        {
          type: 'input',
          name: 'exposeHost',
          message: 'Host machine port',
          when: function(answers) {
            return answers.exposeAction != null && answers.exposeAction !== 'remove';
          },
          default: function(answers) {
            if(answers.exposeAction !== 'add') {
              var expose = docker.expose[answers.exposeAction];
              if(typeof expose == 'string' || typeof expose == 'number') {
                return '';
              }
              else {
                for(var exposeEltId in expose) {
                  return exposeEltId;
                }
              }
            };
          }
        }
      ];
      var deferred = Q.defer();
      inquirer.prompt(questions, function (answers) {
        if(answers.exposeAction != null && answers.exposeName != '') {
          if(answers.exposeAction == 'remove') {
            docker.expose.splice(answers.exposeToRemove, 1);
          }
          else {
            if(answers.exposeHost.trim() != '') {
              var expose = {};
              expose[answers.exposeHost] = answers.exposeContainer;
            } else {
              var expose = answers.exposeContainer;
            }
            if(answers.exposeAction == 'add') {
              if(docker.expose == null) {
                docker.expose = [];
              }
              docker.expose.push(expose);
            }
            else { // action : modify
              docker.expose.splice(answers.exposeAction, 1, expose);
            }
          }
          exposeInquirer(docker)
            .then(function() {
              deferred.resolve();
            });
        } else {
          deferred.resolve();
        }
      });
      return deferred.promise;
    });
    return exposeInquirer(docker);
  };

  return Task;
})();

module.exports = new Task();
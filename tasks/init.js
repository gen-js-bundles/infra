var
  inquirer = require("inquirer"),
  fs = require('fs'),
  path = require('path'),
  gfile = require('gfilesync'),
  yaml = require('js-yaml');

module.exports = {
  do: function(data, callback) {

    var dependenciesChoices = [
      {
        name: "Test - Spring Boot Test",
	value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-test",
          scope: "test"
        }
      },
      {
        name: "Spring Data - JDBC",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-jdbc"
        }
      },
      {
        name: "Spring Data - JPA",
        value: {
         groupId: "org.springframework.boot",
         artifactId: "spring-boot-starter-data-jpa"
       }
      },
      {
        name: "Spring Data - MongoDB",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-data-mongodb"
        }
      },
      {
        name: "Spring Data - Redis",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-redis"
        }
      },
      {
        name: "Spring Data - Gemfire",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-data-gemfire"
        }
      },
      {
        name: "Spring Data - Solr",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-data-solr"
        }
      },
      {
        name: "Spring Data - Elasticsearch",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-data-elasticsearch"
        }
      },
      {
        name: "Database Driver - Derby",
        value: {
          groupId: "org.apache.derby",
          artifactId: "derby"
        }
      },
      {
        name: "Database Driver - H2",
        value: {
          groupId: "com.h2database",
          artifactId: "h2"
        }
      },
      {
        name: "Database Driver - HSQLDB",
        value: {
          groupId: "org.hsqldb",
          artifactId: "hsqldb"
        }
      },
      {
        name: "Database Driver - MySQL",
        value: {
          groupId: "mysql",
          artifactId: "mysql-connector-java"
        }
      },
      {
        name: "Web - Web",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-web"
        }
      },
      {
        name: "Web - Websocket",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-websocket"
        }
      },
      {
        name: "Web - WS (WebServices)",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-ws"
        }
      },
      {
        name: "Web - Jersey (JAX-RS)",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-jersey"
        }
      },
      {
        name: "Web - Rest Repositories",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-data-rest"
        }
      },
      {
        name: "Web - Mobile",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-mobile"
        }
      },
      {
        name: "Web - Security",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-security"
        }
      },
      {
        name: "Core - AOP",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-aop"
        }
      },
      {
        name: "Core - Atomikos (JTA)",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-jta-atomikos"
        }
      },
      {
        name: "Core - Bitronix (JTA)",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-jta-bitronix"
        }
      },
      {
        name: "I/O - Batch",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-batch"
        }
      },
      {
        name: "I/O - Integration",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-integration"
        }
      },
      {
        name: "I/O - JMS - Hornetq",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-hornetq"
        }
      },
      {
        name: "I/O - AMQP",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-amqp"
        }
      },
      {
        name: "I/O - Mail",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-mail"
        }
      },
      {
        name: "Template Engines - Freemarker",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-freemarker"
        }
      },
      {
        name: "Template Engines - Velocity",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-velocity"
        }
      },
      {
        name: "Template Engines - Groovy Templates",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-groovy-templates"
        }
      },
      {
        name: "Template Engines - Thymeleaf",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-thymeleaf"
        }
      },
      {
        name: "Template Engines - Mustache",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-mustache"
        }
      },
      {
        name: "Social - Facebook",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-social-facebook"
        }
      },
      {
        name: "Social - Linkedin",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-social-linkedin"
        }
      },
      {
        name: "Social - Twitter",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-social-twitter"
        }
      },
      {
        name: "Ops - Actuator",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-actuator"
        }
      },
      {
        name: "Ops - Cloud Connectors",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-cloud-connectors"
        }
      },
      {
        name: "Ops - Remote Shell",
        value: {
          groupId: "org.springframework.boot",
          artifactId: "spring-boot-starter-remote-shell"
        }
      }
    ];

    var questions = [
      {
        type: 'list',
        name: 'javaVersion',
        message: 'Which Java version ?',
        choices: [{
          name: '1.8',
          value: '1.8'
        },{
          name: '1.7',
          value: '1.7'
        },{
          name: '1.6',
          value: '1.6'
        },{
          name: '1.5',
          value: '1.5'
        }],
        default: '1.8'
      },
      {
        type: 'list',
        name: 'buildTool',
        message: 'Which build tool ?',
        choices: [{
          name: 'Maven',
          value: 'maven'
        },{
          name: 'Gradle',
          value: 'gradle'
        }],
        default: 'maven'
      },
      {
        type: 'list',
        name: 'packaging',
        message: 'Which packaging ?',
        choices: [{
          name: 'Jar',
          value: 'jar'
        },{
          name: 'War',
          value: 'war'
        }],
        default: 'jar'
      },
      {
        type: 'checkbox',
        name: 'dependenciesSelected',
        message: 'Which dependencies ?',
        choices: dependenciesChoices
      }
    ];
    inquirer.prompt(questions, function( answers ) {
      /*
      if(answers.buildTool == 'maven') {
        gfile.copy(
          path.join(__dirname,'../model/config.@maven.yml'),
          path.join(process.cwd(),'model/config.@maven.yml'));
      }
      if(answers.buildTool == 'gradle') {
        gfile.copy(
          path.join(__dirname,'../model/config.@gradle.yml'),
          path.join(process.cwd(),'model/config.@gradle.yml'));
      }
      */

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

      if(data.global.maven == null) {
        data.global.maven = {};
      }
      if(data.global.maven.groupId == null) {
        data.global.maven.groupId = 'demo';
      }
      if(data.global.maven.artifactId == null) {
        data.global.maven.artifactId = 'myapp';
      }
      if(data.global.maven.packaging == null) {
        data.global.maven.packaging = answers.packaging;
      }

      if(data.global.version == null) {
        data.global.version = {};
      }
      data.global.version.springboot = '1.2.2';
      if(data.global.version.java == null) {
        data.global.version.java = answers.javaVersion;
      }
      
      if(data.global.build == null) {
        data.global.build = {};
      }
      data.global.build.tool = answers.buildTool;

      gfile.writeYaml(path.join(process.cwd(),'Genjsfile.yml'), data);

      var data = {
        dependencies: answers.dependenciesSelected
      };

      gfile.writeYaml(path.join(process.cwd(),'model','config.@build.yml'), data);

      if(callback) {
        callback();
      }
    });
  }
};

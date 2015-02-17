# Infra

# Vagrant

* ```server.yml```

```
ip: 192.168.29.101
memory: 1536

tags:
  vagrant:
    sh:
      - install:
          - nano
          - locate
          - docker
          - fig
```

# Docker

## Tomcat
* ```tomcat.yml``` :

```
server: server

tags:
  docker:
    from: ubuntu
    run:
      install:
        - tomcat
    volume:
      - /target
    expose:
      - 8080: 8080
      - 22
    links:
      mongodb
    cmd:
      [ "/opt/tomcat/bin/catalina.sh" ]
```

## MongoDB
* ```mongodb```

```
server: server

tags:
  docker:
    from: ubuntu
    run:
      install:
        - mongodb
    cmd:
      service mongod start
```
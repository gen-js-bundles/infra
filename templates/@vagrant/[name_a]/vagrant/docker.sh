<%
  var dockers = [];
  _.each(allEntities, function(entity) {
    if(entity.tags != null && entity.tags.docker != null) {
      dockers.push(entity);
    }
  });

  _.each(dockers, function(docker) {
    var name = docker.name.a();
%>
cd docker
sudo docker build -t $__name__$ $__name__$
sudo docker run -t -i $__name__$
<%
  });
%>
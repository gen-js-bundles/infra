<%
  var server = entity;
  var vagrant = entity.tags.vagrant;
  if(vagrant.sh != null) {
    each(vagrant.sh, function(command) {
%>
<%= Shell.sh(command) %>
<%
    });
  }
%>
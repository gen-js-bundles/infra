<% var server = entity; %>
# Run
<% if(server.tags.vagrant != null) { %>
cd vagrant
vagrant halt
<% } %>

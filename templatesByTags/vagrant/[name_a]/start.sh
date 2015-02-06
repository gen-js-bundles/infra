<% var server = entity; %>
# Run
<% if(server.tags.vagrant != null) { %>
cd vagrant
vagrant provision
vagrant up
vagrant ssh
<% } %>

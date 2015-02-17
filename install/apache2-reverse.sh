sudo a2dissite default

cat <<EOT >> /etc/apache2/sites-available/jenkins.conf
<VirtualHost *:<%=portOrigin%>>
	ServerAdmin webmaster@localhost
	ServerName <%=serverName%>
	ServerAlias ci
	ProxyRequests Off
	<Proxy *>
		Order deny,allow
		Allow from all
	</Proxy>
	ProxyPreserveHost on
	ProxyPass / http://localhost:<%=portDest%>/ nocanon
	AllowEncodedSlashes NoDecode
</VirtualHost>
EOT

sudo a2ensite jenkins
sudo apache2ctl restart

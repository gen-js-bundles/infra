sudo a2dissite default

cat <<EOT >> /etc/apache2/sites-available/jenkins.conf
line 1
line 2

<VirtualHost *:80>
	ServerAdmin webmaster@localhost
	ServerName ci.company.com
	ServerAlias ci
	ProxyRequests Off
	<Proxy *>
		Order deny,allow
		Allow from all
	</Proxy>
	ProxyPreserveHost on
	ProxyPass / http://localhost:8080/ nocanon
	AllowEncodedSlashes NoDecode
</VirtualHost>
EOT

sudo a2ensite jenkins
sudo apache2ctl restart

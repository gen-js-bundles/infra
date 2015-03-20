# jenkins
wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update -y
sudo apt-get install -y jenkins jenkins-cli

# update jenkins
#wget -q http://mirrors.jenkins-ci.org/war/latest/jenkins.war /usr/share/jenkins/jenkins.war

sudo service jenkins restart

# install plugin
sudo jenkins-cli -s http://localhost:8080 install-plugin docker-build-step
sudo jenkins-cli -s http://localhost:8080 install-plugin docker-build-publish
sudo jenkins-cli -s http://localhost:8080 install-plugin github

wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins

# update jenkins
wget -q http://mirrors.jenkins-ci.org/war/latest/jenkins.war /usr/share/jenkins/jenkins.war

# install plugin
jenkins-cli -s http://localhost:8080 install-plugin docker-build-step
jenkins-cli -s http://localhost:8080 install-plugin docker-build-publish

# jenkins
wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update -y
sudo apt-get install -y jenkins jenkins-cli

# wait restart
sudo service jenkins restart
while [[ `curl -sL -w "%{http_code}" "http://localhost:8080" -o /dev/null` != 200 ]]; do sleep 50; done

# install plugin
sudo jenkins-cli -s http://localhost:8080 install-plugin docker-build-step
sudo jenkins-cli -s http://localhost:8080 install-plugin docker-build-publish
sudo jenkins-cli -s http://localhost:8080 install-plugin github

# restart jenkins
sudo service jenkins restart

# jenkins
wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update -y
sudo apt-get install -y jenkins jenkins-cli

# wait restart
sudo service jenkins restart
#while netstat -lnt | awk '$4 ~ /:8080$/ {exit 1}'; do sleep 10; done
#curl -sL -w "%{http_code}" "http://localhost:8080" -o /dev/null
#result=`curl -sL -w "%{http_code}" "http://localhost:8080" -o /dev/null`
#if [[ `curl -sL -w "%{http_code}" "http://localhost:8080" -o /dev/null` == 200 ]] then echo "toto" fi;
while [[ `curl -sL -w "%{http_code}" "http://localhost:8080" -o /dev/null` != 200 ]]; do sleep 10; done

# install plugin
sudo jenkins-cli -s http://localhost:8080 install-plugin docker-build-step
sudo jenkins-cli -s http://localhost:8080 install-plugin docker-build-publish
sudo jenkins-cli -s http://localhost:8080 install-plugin github

# restart jenkins
sudo service jenkins restart

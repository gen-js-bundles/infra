# uninstall openjdk
sudo apt-get purge -yq openjdk-\*

<%
  if(version == '1.6') {
%>

# Java 1.6 Sun
sudo apt-get install sun-java6-sdk
update-java-alternatives -s java-6-sun
echo "export JAVA_HOME=/usr/lib/jvm/java-6-sun" >> ~/.bashrc

<%
  } else if(version == '1.7') {
%>

# Java 1.7 Oracle
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java7-installer
update-java-alternatives -s java-7-oracle
echo "export JAVA_HOME=/usr/lib/jvm/java-7-oracle" >> ~/.bashrc

<%
  } else if(version == '1.8') {
%>

# Java 1.8 Oracle
sudo add-apt-repository ppa:webupd8team/java -y
sudo apt-get update
sudo echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
sudo apt-get -y install oracle-java8-installer && apt-get clean
update-java-alternatives -s java-8-oracle
echo "export JAVA_HOME=/usr/lib/jvm/java-8-oracle" >> ~/.bashrc

<%
  }
%>

# Apache Tomcat $__TOMCAT_MINOR_VERSION__$
sudo wget -q https://archive.apache.org/dist/tomcat/tomcat-$__TOMCAT_MAJOR_VERSION__$/v$__TOMCAT_MINOR_VERSION__$/bin/apache-tomcat-$__TOMCAT_MINOR_VERSION__$.tar.gz
sudo wget -qO- https://archive.apache.org/dist/tomcat/tomcat-$__TOMCAT_MAJOR_VERSION__$/v$__TOMCAT_MINOR_VERSION__$/bin/apache-tomcat-$__TOMCAT_MINOR_VERSION__$.tar.gz.md5 | md5sum -c -
sudo tar zxf apache-tomcat-*.tar.gz
sudo rm apache-tomcat-*.tar.gz
sudo ln -s apache-tomcat* tomcat

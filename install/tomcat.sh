# Apache Tomcat $__TOMCAT_MINOR_VERSION__$
wget -q https://archive.apache.org/dist/tomcat/tomcat-$__TOMCAT_MAJOR_VERSION__$/v$__TOMCAT_MINOR_VERSION__$/bin/apache-tomcat-$__TOMCAT_MINOR_VERSION__$.tar.gz
wget -qO- https://archive.apache.org/dist/tomcat/tomcat-$__TOMCAT_MAJOR_VERSION__$/v$__TOMCAT_MINOR_VERSION__$/bin/apache-tomcat-$__TOMCAT_MINOR_VERSION__$.tar.gz.md5 | md5sum -c - 
tar zxf apache-tomcat-*.tar.gz
rm apache-tomcat-*.tar.gz
mv apache-tomcat* tomcat
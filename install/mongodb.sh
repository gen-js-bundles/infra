# MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo apt-get install -y mongodb-org=$__version__$ mongodb-org-server=$__version__$ mongodb-org-shell=$__version__$ mongodb-org-mongos=$__version__$ mongodb-org-tools=$__version__$
sudo service mongod start
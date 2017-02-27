# Install NodeJS
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install

sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 7540
mkdir data

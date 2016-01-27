VoKS-server
===========

This project constitutes the server part of the BComeSafe alarm system. Its purpose is to facilitate communication between the other parts of the system, particularly setting up audio and video connections and proxying messages.

...More responsibilities ???



Deploying the server
--------------------

The server code is written in JavaScript, to be run in the Node.js environment.

###Install NodeJS (in CentOS environment)###
download the file

    sudo curl -O https://rpm.nodesource.com/pub_0.12/el/6/x86_64/nodejs-0.12.7-1nodesource.el6.x86_64.rpm
install the rpm

    sudo rpm -Uvh nodejs-0.12.7-1nodesource.el6.x86_64.rpm
remove downloaded file

    sudo rm nodejs-0.12.7-1nodesource.el6.x86_64.rpm

verify node works

    node -v


###Confguration files###
Move configs/env.example.js and configs/http.example.js to env.js and http.js, change them acording to your needs (port, adresses, etc)

Open port witch configured in configs/http.js

Install npm packages by running command:

    npm install


### Instal Supervisor###
Installation instructions located here: [http://supervisord.org/installing.html](http://supervisord.org/installing.html)

Append these lines at the bottom in configuration file located here: /etc/supervisord.conf

    [supervisord]
    logfile_maxbytes = 3145728
    logfile_backups = 1
    [include]
    files = /etc/supervisord/*.conf

Add configuration file located here: /etc/supervisord/websockets.conf

    [program:websockets]
    command=node /var/www/html/server/server.js  
    autostart=true
    autorestart=true  
    environment=NODE_ENV=production
    stderr_logfile=/var/log/websockets.error.log
    stdout_logfile=/var/log/websockets.output.log
    
Restart supervisor service: 

    service supervisord restart



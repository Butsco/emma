'use strict';
const config = require('./config.js');
const http = require('http');
const express_app = require('./api.js').express_app;
const server = http.Server(express_app);
const emma = require('./emma.js');

//const app = require('app.js');
//const config = require('core/config.js').config;

// Define port & startup
var port = process.env.PORT || 5001;
server.listen(port);
console.log('Started on ' + port);

if (!config.isHeroku) {
    emma.setup();

    express_app.on('docker_callback', function (data) {
        console.log('Received a callback: ' + JSON.stringify(data));
        emma.onDocker(data);
    });
}

//lt --port 8000 --
//lt --port 5001 --subdomain=emmatc
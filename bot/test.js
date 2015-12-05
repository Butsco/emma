'use strict';
const docker = require('./docker.js');
const request = require('request');

var options = {
    url: 'http://localhost:5001/d/h8xiF9Yapp',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(docker.example)
};

request.post(options, function(error, response, body){
    console.log(body);
});


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


var options2 = {
    url: 'http://localhost:5001/users/',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        username: "lukin0110",
        slackName: "lukin0110",
        slackToken: "xoxb-16003922068-RVCg2fm5zfjVcpAdpB0mWWnT",
        awsAccessKeyId: "AKIAJI4LKMZ3XSK42P7A",
        awsSecretAccessKey: "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"
    })
};

request.put(options2, function(error, response, body) {
    console.log(body);
});

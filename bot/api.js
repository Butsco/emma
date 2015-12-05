'use strict';
const data = require('./data.js');
const bodyParser = require('body-parser');
const express = require('express');
const events = require('events');
const util = require('util');
const _ = require('lodash');
const app = express();
util.inherits(express, events.EventEmitter);
events.EventEmitter.call(app);

/**
 * Allow CORS, needed for Cross Domain Ajax calls
 */
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    next();
});

// Consume JSON bodies
app.use(bodyParser.json({limit: '1.5mb'}));

function index(req, res) {
    res.send({
        message: 'Hello Cutie'
    });
}

/**
 * http://localhost:5001/docker/webhook/h8xiF9Yapp
 *
 * @param req
 * @param res
 */
function webhook(req, res) {
    let body = req.body;
    let id = req.params['id'];
    console.log("Docker webhook Id: " + id);
    app.emit('docker_callback', {id: id, body: body});

    res.send({
        status: 'done'
    });
}

/**
 * var body = {
 *   "username": "lukin0110",
 *   "slackName": "lukin0110",
 *   "slackToken": "xoxb-16003922068-RVCg2fm5zfjVcpAdpB0mWWnT",
 *   "awsAccessKeyId": "AKIAJI4LKMZ3XSK42P7A",
 *   "awsSecretAccessKey": "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"
 * };
 *
 * @param req
 * @param res
 */
function save(req, res) {
    let body = _.cloneDeep(req.body);
    let username = body['username'];
    delete body['username'];

    data.save(username, body)
        .then(function(user) {
            res.send({
                status: "created",
                id: user.id,
                docker: util.format('http://emma.lukin.be/docker/webhook/%s', user.id)
            });
        });
}

app.get('/', index);
app.post('/d/:id', webhook);
app.put('/users/', save);


//
// Export the express app
//
module.exports = {
    express_app: app
};

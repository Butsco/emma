//// server.js
const express = require('express');
//var cors = require('cors');
//var bodyParser = require('body-parser');
//var _ = require('lodash');
const httpProxy = require('http-proxy');
//
//// setup server
const app = express();
const proxy = httpProxy.createProxyServer();


const jwt = require('express-jwt');

const jwtCheck = jwt({
    secret: new Buffer('o3lGexG_E1VIBxLbNhJO_fE2M_3gL1qI5JITHFaXF14lIGjbeyRLx5As9Gi3SS1o', 'base64'),
    audience: 'yGobESzQr9KxIiM0NUzs9BLTA8yNCspI'
});
//
//app.use(cors());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
//
//

// static content to host our app
app.use(express.static(__dirname + '/app'));

const webpackServer = require('./webpackServer.js');
webpackServer();


// Any requests to localhost:3000 is proxied
// to webpack-dev-server
app.all('/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8080'
    });
});

//catch any errors from the proxy or the server will crash
proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
})

// Start server
app.listen(3000, 'localhost', function () {
    console.log('Express server listening on %d, in %s mode', 8080, 'localhost');
});
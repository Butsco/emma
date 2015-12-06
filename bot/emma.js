/**
 * Add a bot at https://my.slack.com/services/new/bot and copy the token here.
 *
 * https://github.com/slackhq/node-slack-client/
 */
'use strict';
const config = require('./config.js');
const data = require('./data.js');
const Slack = require('slack-client');
const util = require('util');
const lib = require('./slack.js');
const _ = require('lodash');

// Automatically reconnect after an error response from Slack.
const autoReconnect = true;
// Automatically mark each message as read after it is processed.
const autoMark = true;

var clients = {};

function initClient(client) {
    client.on('open', function() {
        //console.log('Emma connected to: ' + client.team.name + ' as ' + client.self.name);
        //console.log(util.inspect(client.users));
        //console.log(lib.getUsernames(client));
        //lib.send(client, 'hello cutie');
    });

    client.on('error', function(err) {
        console.log('Error: ' + err);
    });

    //Connection: {"id":1,"type":"message","channel":"D0G090TCZ","text":"sdfsdf"}
    client.on('message', function(message) {
        let fuzzy = true;

        //Connection: {"id":1,"type":"message","channel":"D0G090TCZ","text":"sdfsdf"}
        console.log('On Message: ' + JSON.stringify(message));
        let channel = client.getChannelGroupOrDMByID(message.channel);
        let user = client.getUserByID(message.user);
        console.log('User: ' + user.name + " , " + user.real_name);
        //console.log(util.inspect(user));

        let confirm = ['yes', 'yess', 'yez', 'yezz', 'sure'];
        let text = _.trim(message.text.toLowerCase());
        //_.includes([1, 2, 3], 1);

        if (_.includes(confirm, text)) {
            fuzzy = false;
            lib.send(client, 'Owkay where? Amazon, Google?');
        }

        if (fuzzy) {
            lib.send(client, 'What???');
        }
    });
}

function setup() {
    console.log('Setting up Emma\'s');
    //client.login();

    data.users().then(function(users) {
        _.each(users, function(user){
            let slackToken = user.get('slackToken');
            let client = new Slack(slackToken, autoReconnect, autoMark);
            client.userObject = user;
            initClient(client);
            client.login();
            clients[user.id] = client;
        });
    });
}


function onDocker(data) {
    let id = data['id'];
    let body = data['body'];
    let client = clients[id];

    let name = body['repository']['name'];
    let description = body['repository']['description'];
    let msg = util.format('Your Docker image \'%s\' is ready', name);

    lib.send(client, msg)
        .then(function(){
            lib.send(client, 'Do you want me to deploy it?');
        });
}

module.exports = {
    setup: setup,
    onDocker: onDocker
};

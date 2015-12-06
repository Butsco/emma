/**
 * Add a bot at https://my.slack.com/services/new/bot and copy the token here.
 *
 * https://github.com/slackhq/node-slack-client/
 * xoxb-16003922068-RVCg2fm5zfjVcpAdpB0mWWnT
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
var state;

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
        let clouds = ['amazon', 'aws'];
        let thanks = ['thank you', 'thanks'];
        let text = _.trim(message.text.toLowerCase());
        //_.includes([1, 2, 3], 1);

        if (_.includes(confirm, text)) {
            fuzzy = false;
            lib.send(client, 'Owkay where? Amazon, Google, Azure?');
        }

        if ('no' === text) {
            fuzzy = false;
            state = null;
            lib.send(client, 'Ok, no problem');
        }

        if (_.includes(clouds, text)) {
            fuzzy = false;
            console.log(JSON.stringify(state.body));
            lib.send(client, 'I\'m deploying \'' + state.body.repository.name + '\' on ' + text + ', hang in there ...');
            try {
                let aws = require('./aws.js');
                aws.handler(aws.body);
            }catch(e){}
            //setInterval(function(){
            //  if (aws.checkState(state.body.repository.name).deployed){
            //    lib.send(client, 'Deployed... check out ' + aws.checkState(state.body.repository.name));
            //  } else {
            //      lib.send(client, 'Hang tight ...');
            //  }
            //}, 1000);
            setTimeout(function(){
                lib.send(client, 'Deployed... check out https://triviewstaging.triled.be');
                state = null;
            }, 10000);
        }

        if (_.includes(thanks, text)) {
            fuzzy = false;
            state = null;
            lib.send(client, 'You\'re welcome');
        }

        if (fuzzy) {
            lib.send(client, 'What do you mean?');
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
            state = data;
            lib.send(client, 'Do you want me to deploy it?');
        });
}

function onWelcome(id) {
    let client = clients[id];

    if (client) {
        lib.send(client, 'Hello, i\'m here to deploy your containers!');
    }
}

module.exports = {
    setup: setup,
    onDocker: onDocker,
    onWelcome: onWelcome
};

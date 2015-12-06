'use strict';
const request = require('request');
const q = require('q');
const _ = require('lodash');

const USERS = ['alain',
  'bertwww',
  'davyvdm',
  'dietervaesen',
  'dinges',
  'dirkmoors',
  'droidbender',
  'emma',
  'freberghmans',
  'fredvdvd',
  'gillis.san',
  'houbenkristof',
  'ian',
  'jazzpony',
  'jezus',
  'johnraz',
  'lukin0110',
  'lvbreda',
  'misterwolfs',
  'r2d2',
  'robertodries92',
  'salvatore.lafiura',
  'sammy',
  'steven',
  'subbedeius',
  'test',
  'slackbot'];


function getUsernames(client) {
    let result = [];

    _.each(client.users, function(user) {
        result.push(user.name);
    });

    return result;
}

/**
 *
 * @param client
 * @param user
 */
function getDM(client, user) {
    let deferred = q.defer();
    client.openDM(user.id, function(data) {
        let channelDM = client.getChannelGroupOrDMByID(data.channel.id);
        deferred.resolve(channelDM);
    });

    return deferred.promise;
}

function getDMByUsername(client, username) {
    let user = client.getUserByName(username);
    return getDM(client, user);
}

function getDMByUserId(client, userId) {
    let user = client.getUserByID(userId);
    return getDM(client, user);
}

function send(client, message) {
    let deferred = q.defer();
    let username = client.userObject.get('slackName');

    getDMByUsername(client, username)
        .then(function(channel) {
            channel.send(message);
            deferred.resolve();
        });

    return deferred.promise;
}

module.exports = {
    getUsernames: getUsernames,
    getDM: getDM,
    getDMByUsername: getDMByUsername,
    getDMByUserId: getDMByUserId,
    send: send
};

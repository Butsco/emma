'use strict';
const config = require('./config.js');
const q = require('q');
const Parse = require('parse/node');
const _ = require('lodash');
Parse.initialize(config.parse.appId, config.parse.key, config.parse.master);

/**
 *
 * @param {string} username
 * @returns {*|promise}
 */
function getUserObject(username) {
    let deferred = q.defer();
    let query = new Parse.Query(Parse.User);

    query.equalTo('username', username);
    query.first({
        success: function(object) {
            console.log("Fetched: " + username + ", " + object);
            if (!object) {
                object = new Parse.User();
                object.set('username', username);
                object.set('password', 'dummySlack');
            }

            deferred.resolve(object);
        },
        error: function(err) {
            console.log("Error: " + err);
            let newUser = new Parse.User();
            newUser.set('username', username);
            newUser.set('password', 'dummySlack');
            deferred.resolve(newUser);
        }
    });

    return deferred.promise;
}

function fetchBySlackToken(slackToken) {
    let deferred = q.defer();
    let query = new Parse.Query(Parse.User);
    query.equalTo('slackToken', slackToken);
    query.first({
        success: function(object) {
            if (object) {
                deferred.reject(new Error("'slackToken' already exists"));
            } else {
                deferred.resolve({});
            }
        },
        error: function() {
            deferred.reject();
        }
    });

    return deferred.promise;
}

/**
 *
 * @param {string} githubName
 * @param {object} data
 * @returns {*|promise}
 */
function save(githubName, data) {
    var deferred = q.defer();
    Parse.Cloud.useMasterKey();

    function handle(user) {
        let keys = Object.keys(data);
        _.each(keys, function (key) {
            user.set(key, data[key]);
        });
        user.save({
            success: function(sUser){
                console.log("Success");
                deferred.resolve(sUser);
            },
            error: function(sUser, sError) {
                console.log("Error Save: " + sError);
                deferred.reject(sError);
            }
        });
    }

    //q.fcall(getUserObject, githubName)
    //q.fcall(fetchBySlackToken, data['slackToken'])
    //    .then(getUserObject.bind(null, githubName))
    q.fcall(getUserObject, githubName)
        .then(handle)
        .fail(function(err){
            deferred.reject(err);
        })
        .done();

    return deferred.promise;
}

/**
 * @param {string} slackToken
 * @returns {*|promise}
 */
function getUserBySlackToken(slackToken) {
    let deferred = q.defer();
    let query = new Parse.Query(Parse.User);

    query.equalTo('slackToken', slackToken);
    query.first({
        success: function(object) {
            deferred.resolve(object);
        },
        error: function(error) {
            deferred.reject(error);
        }
    });

    return deferred.promise;
}

function users() {
    let deferred = q.defer();
    let query = new Parse.Query(Parse.User);

    query.find({
        success: function(results) {
            deferred.resolve(results);
        },
        error: function(error) {
            deferred.reject(error);
        }
    });

    return deferred.promise;
}

module.exports = {
    save: save,
    users: users,
    getUserBySlackToken: getUserBySlackToken
};

/*
users().then(function(results){
    console.log(results);
});
*/

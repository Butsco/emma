// HARDCODING STUFF For the moment .... it's a hackathon!
var q = require('q');
var config = require('./config.js');
var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
});
var ecs = new AWS.ECS({apiVersion: '2014-11-13'});

var SERVICES = {
    TriView: {serviceName: 'TriView', taskDefinition: 'TriView', docker: 'triled/triview'},
    TriRemote: {serviceName: 'TriRemote', taskDefinition: 'TriRemote', docker: 'triled/triremote'}
};
var CLUSTER = 'TriView';

/**
 * List all the running tasks of a certain service.
 *
 * @param {string} cluster
 * @param {string} serviceName
 * @returns {*|promise}
 */
function listTasks(cluster, serviceName) {
    var deferred = q.defer();

    var params = {
        cluster: cluster,
        desiredStatus: 'RUNNING',
        serviceName: serviceName
    };

    ecs.listTasks(params, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
}

/**
 * Based on the results of 'listTasks' we'll stop all the tasks.
 *
 * @param {string} cluster
 * @param {object} data
 * @returns {*|promise}
 */
function stopTasks(cluster, data) {
    /*
    {
        "taskArns": [
            "arn:aws:ecs:eu-west-1:483115737820:task/d53e281e-0412-460a-99d8-db75cee0e3f4"
        ]
    }
     */
    var deferred = q.defer();

    var params = {
        task: data['taskArns'][0],
        cluster: cluster
    };

    ecs.stopTask(params, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
}

/**
 * Fetch the latest revision of a taskDefinition.
 *
 * @param {string} taskDefinitionName
 * @returns {*|promise}
 */
function getTaskDefinition(taskDefinitionName) {
    var deferred = q.defer();

    var params = {
        taskDefinition: taskDefinitionName
    };

    ecs.describeTaskDefinition(params, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
}

/**
 * Based on the results of 'getTaskDefinition' we'll create a new revision with the exact same configuration
 *
 * @param {object} data
 * @returns {*|promise}
 */
function createRevision(data) {
    var deferred = q.defer();

    var params = {
        containerDefinitions: data['taskDefinition']['containerDefinitions'],
        family: data['taskDefinition']['family']
    };

    ecs.registerTaskDefinition(params, function(err, data) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(data);
        }
    });

    return deferred.promise;
}

/**
 * Update a service with the provided taskDefinition. The new definition is created in 'createRevision'.
 *
 * @param {string} serviceName
 * @param {string} taskDefinition
 * @returns {*|promise}
 */
function updateService(serviceName, taskDefinition) {
    var deferred = q.defer();
    var error = false;

    if (!serviceName) {
        error = true;
        deferred.reject(new Error('\'serviceName\' can\'t be empty'));
    }

    if (!taskDefinition) {
        error = true;
        deferred.reject(new Error('\'taskDefinition\' can\'t be empty'));
    }

    if (!error) {
        var params = {
            service: serviceName,
            cluster: 'TriView',
            desiredCount: 1,
            taskDefinition: taskDefinition
        };

        ecs.updateService(params, function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
    }

    return deferred.promise;
}

/**
 *
 * @param {object} serviceConfig - config item from the SERVICES const
 * @param {string} cluster
 * @param {object} context
 */
function deploy(serviceConfig, cluster, context) {
    var revisionArn = null;

    q.fcall(getTaskDefinition, serviceConfig.taskDefinition)
        .then(createRevision)
        .then(function(revisionData) {
            revisionArn = revisionData['taskDefinition']['taskDefinitionArn'];
            return [cluster, serviceConfig.serviceName];
        })
        .spread(listTasks)
        .then(function(tasksData) {
            return [CLUSTER, tasksData];
        })
        .spread(stopTasks)
        .then(function(){
            return [serviceConfig.serviceName, revisionArn];
        })
        .spread(updateService)
        .then(function(data) {
            //console.log(JSON.stringify(data, null, 4));
            context.resolve({status: 'ok', taskDefinition: data['service']['taskDefinition']});
        })
        .fail(function(err) {
            console.log(err);
            context.reject(err);
        })
        .catch(function(err) {
            console.log(err);
            context.reject(err);
        })
        .done();
}

/**
 * - Select a service
 * - Fetch task definition
 * - Create task definition revision
 * - Get active tasks for the service
 * - Stop all the the active tasks
 * - Update the service
 *
 * @param {object} data
 */
function handler(data) {
    var deferred = q.defer();
    var deploying = false;

    if (data['push_data'] && data['repository']) {
        var repo_name = data['repository']['repo_name'];
        var services = SERVICES;

        for (var key in services) {
            if (services.hasOwnProperty(key)) {
                var item = services[key];

                if (repo_name === item['docker']) {
                    console.log('Service found: ' + key);
                    deploying = true;
                    deploy(item, CLUSTER, deferred);
                }
            }
        }

    } else if (data['service']) {
        console.log('Manual deploy');
        var item2 = SERVICES[data['service']];

        if (item2) {
            console.log('Service found: ' + data['service']);
            deploying = true;
            deploy(item2, CLUSTER, deferred);
        }
    }

    if (!deploying) {
        deferred.reject(new Error('Invalid POST body received'));
    }

    return deferred.promise;
}

module.exports = {
    handler: handler
};

'use strict';
const _ = require('lodash');

const example = {
    'push_data': {
        'pushed_at': 1385141110,
        'images': [
            'imagehash1',
            'imagehash2',
            'imagehash3'
        ],
        'pusher':'username'
    },
    'repository': {
        'status':'Active',
        'description':'my docker repo that does cool things',
        'is_trusted':false,
        'full_description':'This is my full description',
        'repo_url':'https://registry.hub.docker.com/u/username/reponame/',
        'owner':'username',
        'is_official':false,
        'is_private':false,
        'name':'triled/triview',
        'namespace':'username',
        'star_count':1,
        'comment_count':1,
        'date_created':1370174400,
        'dockerfile':'my full dockerfile is listed here',
        'repo_name':'triled/triremote'
    }
};

module.exports = {
    example: example
};

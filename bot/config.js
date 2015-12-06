'use strict';
//process.env.PORT

var config = {
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
    },
    parse: {
        appId: 'nHPuaicHGtmZYH19UlbdNVkVdUnHBqjLekJkSBfW',
        key: '9FfeJyUY5QkKguBpomSMILVHt1vd9kdETb8J2Uka',
        master: 'MS6eZNzXx7740LXmQynqDNhyW8lB8WG6yatwRR10'
    },
    //webhook: 'http://emma.lukin.be/d/%s'
    webhook: 'http://emmatc.localtunnel.me/d/%s'
    //webhook: 'https://emmatc.herokuapp.com/d/%s'
};

var isHeroku = process.env.PORT ? true : false;
if (isHeroku) {
    config.webhook = 'https://emmatc.herokuapp.com/d/%s';
}

module.exports = config;

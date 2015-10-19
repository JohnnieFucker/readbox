var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis);
var utils = require('./utils.js');


var redisConfig = require(utils.configDir+'/redisConfig.json');
var redisClient = redis.createClient(redisConfig.dataServer.port, redisConfig.dataServer.host);
var jwtRedisClient = redis.createClient(redisConfig.jwtServer.port, redisConfig.jwtServer.host);

module.exports = {
    redisClient: redisClient,
    jwtRedisClient:jwtRedisClient
};
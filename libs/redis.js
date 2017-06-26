var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis);
var loader = require('./loadConfig.js');


var redisConfig = require(loader.configFile)[loader.projectName].redis;
var redisClient = redis.createClient(redisConfig.dataServer.port, redisConfig.dataServer.host);
var jwtRedisClient = redis.createClient(redisConfig.jwtServer.port, redisConfig.jwtServer.host);

module.exports = {
    redisClient: redisClient,
    jwtRedisClient:jwtRedisClient
};
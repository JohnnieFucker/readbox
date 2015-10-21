'use strict';
var mongodb = require('./mongodb.js');
var redis = require('./redis.js').redisClient;
var utils = require('./utils.js');
class BaseController{
    constructor() {
        this.redis = redis;
    };
}
module.exports = BaseController;
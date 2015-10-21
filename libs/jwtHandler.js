var jwt = require('jwt-simple');
var redis = require('./redis.js').jwtRedisClient;
var crypto = require('crypto');
var utils = require('./utils.js');

var jwtSecret = require(utils.configDir + '/serverConfig.json').jwtSecret;

var jwtHandler = {
    checkJWT: function (req, cb) {
        var jwtStr = req.headers['x-json-web-token'] || '';
        if (jwtStr != '') {
            var payload = jwt.decode(jwtStr, jwtSecret);
            if (payload && payload.user_id && payload.token) {
                redis.getAsync('token:' + payload.user_id).then(function (result) {
                    if (result == payload.token) {
                        req.session.user_id = payload.user_id;
                        return cb(true);
                    }
                    cb(false);
                }).catch(function (e) {
                    error(e.stack || e.message || e);
                    cb(false);
                });
            } else {
                cb(false);
            }
        } else {
            cb(false);
        }
    },
    getToken: function (user_id, cb) {
        var tokenKey = 'token:' + user_id;
        redis.getAsync(tokenKey).then(function(res){
            if(res){
                return cb(res);
            }
            //不存在token生成新的
            var hash = utils.md5(user_id + utils.moment() + jwtSecret);
            return redis.setAsync(tokenKey, hash)
            //    .then(function(){
            //    //return redis.expireAsync(tokenKey, 30*24*60*60);
            //})
            .then(function(){
                cb(hash);
            })
        }).catch(function(err){
            error('get token err: ' + err.stack||err);
        });
    },
    getJWT: function (user_id, cb) {
        var _this = this;
        _this.getToken(user_id, function (token) {
            var payload = {
                user_id: user_id,
                token: token
            };
            cb(jwt.encode(payload, jwtSecret));
        });
    },
    removeToken: function (user_id) {
        var tokenKey = 'token:' + user_id;
        redis.delAsync(tokenKey).catch(function (err) {
            error('removeToken err:' + err);
        });
    }
};
module.exports = jwtHandler;
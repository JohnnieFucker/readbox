'use strict';
var mongodb = require('./mongodb.js');
var redis = require('./redis.js').redisClient;
var utils = require('./utils.js');
var RESULT_TRUE = 'TRUE';
var RESULT_FALSE = 'FALSE';
var need_encrypt = require(utils.configDir + '/serverConfig.json').need_encrypt;

class BaseService{
    constructor() {
        this.redis = redis;
        this.restSuccess = restSuccess;
        this.restError  = restError;
    };
}

/**
 * 处理成功返回
 */
function restSuccess(res, data, other_datas){
    var result = {result: RESULT_TRUE};
    if (data) {
        result.data = data;
    }
    if (other_datas) {
        for (var key in other_datas) {
            result[key] = other_datas[key];
        }
    }
    if(need_encrypt){
        result = utils.encodeResult(JSON.stringify(result));
        rest(res,{encode_str:result});
    }else{
        rest(res,result);
    }
}

/**
 * 处理错误返回
 */
function restError(res,err_code, err_msg){
    var result = {result: RESULT_FALSE};
    if (err_code) {
        result.errorcode = err_code;
    }
    if (err_msg) {
        result.msg = err_msg;
    }
    if(need_encrypt){
        result = utils.encodeResult(JSON.stringify(result));
        rest(res,{encode_str:result});
    }else{
        rest(res,result);
    }
}

function rest(res, data){
    res.send(data);
}

module.exports = BaseService;
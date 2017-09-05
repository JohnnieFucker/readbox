
const mongodb = require('./mongodb.js');
const redis = require('./redis.js').redisClient;
const utils = require('./utils.js');
const loader = require('./loadConfig');

const RESULT_TRUE = 'TRUE';
const RESULT_FALSE = 'FALSE';
const config = require(loader.configFile)[loader.projectName];

class BaseService {
    constructor() {
        this.redis = redis;
        this.config = config;
        this.restSuccess = restSuccess;
        this.restError = restError;
    }
}

/**
 * 处理成功返回
 */
function restSuccess(res, data, other_datas) {
    let result = { result: RESULT_TRUE };
    if (data) {
        result.data = data;
    }
    if (other_datas) {
        for (const key in other_datas) {
            result[key] = other_datas[key];
        }
    }
    if (config.need_encrypt) {
        result = utils.encodeResult(JSON.stringify(result));
        rest(res, { encode_str: result });
    } else {
        rest(res, result);
    }
}

/**
 * 处理错误返回
 */
function restError(res, err_code, err_msg) {
    let result = { result: RESULT_FALSE };
    if (err_code) {
        result.errorcode = err_code;
    }
    if (err_msg) {
        result.msg = err_msg;
    }
    if (config.need_encrypt) {
        result = utils.encodeResult(JSON.stringify(result));
        rest(res, { encode_str: result });
    } else {
        rest(res, result);
    }
}

function rest(res, data) {
    res.send(data);
}

module.exports = BaseService;

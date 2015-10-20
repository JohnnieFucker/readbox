'use strict';
var BaseRouter = require('../libs/baseRoute');
var handler = require('../services/wechatService.js');

var services = [];
//登录接口
services.push({
    type:'post',
    url:'/responseMsg',
    handler:handler.responseMsg
});

class Router extends BaseRouter{
    constructor(server,name,config) {
        super(server,name,config);
        this.services = services;
    }
}
module.exports = Router;
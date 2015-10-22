'use strict';
var BaseRouter = require('../libs/baseRoute');
var handler = require('../services/wechatService.js');

var services = [];

//响应微信公众号消息
services.push({
    type:'get',
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
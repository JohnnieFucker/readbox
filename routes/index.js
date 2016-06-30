'use strict';
var BaseRouter = require('../libs/baseRoute');
var handler = require('../controllers/indexController.js');
var services = [];

services.push({
    type:'get',
    url:'/',
    handler:handler.index
});

//登录接口
services.push({
    type:'get',
    url:'/login',
    handler:handler.login
});

//wxbot
services.push({
    type:'get',
    url:'/wxbot',
    handler:handler.wxbot
});

class Router extends BaseRouter{
    constructor(server,name,config) {
        super(server,name,config);
        this.services = services;
    }
}
module.exports = Router;
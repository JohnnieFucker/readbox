'use strict';
var BaseRouter = require('../libs/baseRoute');
var handler = require('../controllers/indexController.js');
var services = [];
//登录接口
services.push({
    type:'get',
    url:'/',
    handler:handler.index
});

class Router extends BaseRouter{
    constructor(server,name,config) {
        super(server,name,config);
        this.services = services;
    }
}
module.exports = Router;
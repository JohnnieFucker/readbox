'use strict';
var BaseRouter = require('../libs/baseRoute');
var handler = require('../services/articleService.js');

var services = [];

//添加
services.push({
    type:'post',
    url:'/add',
    handler:handler.add
});

services.push({
    type:'post',
    url:'/del',
    handler:handler.del
});

services.push({
    type:'get',
    url:'/createMarkdown',
    handler:handler.createMarkdown
});

class Router extends BaseRouter{
    constructor(server,name,config) {
        super(server,name,config);
        this.services = services;
    }
}
module.exports = Router;
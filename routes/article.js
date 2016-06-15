'use strict';
var BaseRouter = require('../libs/baseRoute');
var handler = require('../services/articleService.js');
var controller = require('../controllers/articleController.js');
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
    url:'/getList',
    handler:handler.getList
});

services.push({
    type:'get',
    url:'/createMarkdown/:articleId',
    handler:handler.createMarkdown
});

services.push({
    type:'get',
    url:'/readSquare',
    handler:controller.readSquare
});

services.push({
    type:'get',
    url:'/read/:articleId',
    handler:controller.read
});

class Router extends BaseRouter{
    constructor(server,name,config) {
        super(server,name,config);
        this.services = services;
    }
}
module.exports = Router;
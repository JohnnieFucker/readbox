'use strict';
var fs = require('fs');
var path = require('path');

class BaseRouter{
    constructor(server,name,config) {
        this.server = server;
        this.sysConfig = config;
        this.name = name;
        this.services = [];
    }

    initRouter(){
        var _this = this;
        _this.services.forEach(function (service) {
            var url = (_this.name == 'index' ? '' : _this.name) + service.url;
            switch (service.type.toLowerCase()) {
                case 'get':
                {
                    _this.server.get(url, service.handler);
                    break;
                }
                case 'post':
                {
                    _this.server.post(url, service.handler);
                    break;
                }
                case 'put':
                {
                    _this.server.put(url, service.handler);
                    break;
                }
                case 'del':
                {
                    _this.server.del(url, service.handler);
                    break;
                }
                default:
                {
                    //do nothing;
                }
            }
        });
    }
}
module.exports = BaseRouter;
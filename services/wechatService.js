var BaseService = require('../libs/baseService.js');
var utils =  require('../libs/utils.js');
var wechat = require('wechat');
var service = new BaseService();
var wechatConfig = require(utils.configDir + '/wechatConfig.json');


//登录
service.responseMsg = function(req, res, next){
    if(req.method=='GET'){
        res.send(req.params.echostr);
    }else{
        wechat(wechatConfig,function(req,res,next){
            var message = req.weixin;
            console.log(message);
            res.reply(req.params.echostr);
        });
    }
};

module.exports = service;
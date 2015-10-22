var BaseService = require('../libs/baseService.js');
var utils =  require('../libs/utils.js');
var wechat = require('wechat');
var service = new BaseService();
var wechatConfig = require(utils.configDir + '/wechatConfig.json');


//登录
service.responseMsg = function(req, res, next){
    console.log(wechatConfig);
   wechat(wechatConfig,function(req,res,next){
       var message = req.weixin;
       console.log(message);
       res.reply('hehe');
   });
};

module.exports = service;
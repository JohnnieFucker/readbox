var BaseService = require('../libs/baseService.js');
var utils =  require('../libs/utils.js');
var wechat = require('wechat');
var service = new BaseService();
var wechatConfig = require(utils.configDir + '/wechatConfig.json');


//登录
service.responseMsg = wechat(wechatConfig,function(req,res,next){
    var message = req.weixin;
    if(req.session&&req.session.user_id){
        switch(message.MsgType){
            case 'text':{
            }
            case 'link':{
            }
            default :{
                res.reply("(;´༎ຶД༎ຶ`) 臣妾实在是做不到啊！");
            }
        }
        console.log(message);
    }else{
        res.reply('_|￣|◉ 陛下请先登录您的账号！<a href="http://www.readbox.in/login?from=wechat">点此登录</a>');
    }

});

module.exports = service;
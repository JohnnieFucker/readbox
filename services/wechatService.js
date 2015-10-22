var BaseService = require('../libs/baseService.js');
var utils =  require('../libs/utils.js');
var wechat = require('wechat');
var service = new BaseService();
var wechatConfig = require(utils.configDir + '/wechatConfig.json');


//登录
service.responseMsg = wechat(wechatConfig,function(req,res,next){
    var message = req.weixin;
    var wx_uid = message.FromUserName;
    service.redis.get('wxuid:'+wx_uid,function(error,user_id){
        if(error||!user_id){
            res.reply('_|￣|◉ 陛下请先登录您的账号！<a href="http://www.readbox.in/login?from=wechat&wxuid='+wx_uid+'">点此登录</a>');
        }else{
            console.log(user_id);
            console.log(message);
            switch(message.MsgType){
                case 'text':{
                }
                case 'link':{
                }
                default :{
                    res.reply("(;´༎ຶД༎ຶ`) 臣妾实在是做不到啊！");
                }
            }
        }
    });
});

module.exports = service;
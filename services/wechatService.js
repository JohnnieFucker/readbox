var BaseService = require('../libs/baseService.js');
var utils =  require('../libs/utils.js');
var wechat = require('wechat');
var service = new BaseService();
var wechatConfig = require(utils.configDir + '/wechatConfig.json');
var Article = require('../models/article.js');
var UserArticle = require('../models/userArticle.js');
var articleService = require('./articleService.js');
var readability = require('node-readability');

//登录
service.responseMsg = wechat(wechatConfig,function(req,res,next){
    var message = req.weixin;
    var wx_uid = message.FromUserName;
    service.redis.get('wxuid:'+wx_uid,function(error,user_id){
        if(error||!user_id){
            res.reply('_|￣|◉ 陛下请先登录您的账号！<a href="http://www.readbox.in/login?from=wechat&wxuid='+wx_uid+'">点此登录</a>');
        }else{
            switch(message.MsgType){
                case 'text':{
                    if(utils.checkUrl(message.Content)){
                        addArticleFromWeixin(user_id,message.Content,function(reply){
                            res.reply(reply);
                        });
                    }else{
                        res.reply("(;´༎ຶД༎ຶ`) 臣妾实在是做不到啊！");
                    }
                    break;
                }
                case 'link':{
                    addArticleFromWeixin(user_id,message.Url,function(reply){
                        res.reply(reply);
                    });
                    break;
                }
                default :{
                    res.reply("(;´༎ຶД༎ຶ`) 臣妾实在是做不到啊！");
                }
            }
        }
    });
});

function addArticleFromWeixin(user_id,url,next){
    var url_md5 = utils.md5(url);
    Article.schema.findOne({url_md5: url_md5})
        .select("_id")
        .exec(function (error, result) {
            if (error) {
                next("(;´༎ຶД༎ຶ`) 貌似是服务器被外星人攻占了！");
            } else {
                if (result) {
                    UserArticle.insertIfNoExist(user_id, result._id, function (err) {
                        if (err) {
                            next("(;´༎ຶД༎ຶ`) 貌似是服务器被外星人攻占了！");
                            return;
                        }
                        next("(＝^ω^＝) 陛下，三军列队完毕，请您检阅！/n <a href='http://www.readbox.in/article/read/"+result._id+"'>点此检阅</a>");
                    });
                } else {
                    readability(url, function (err, article) {
                        articleService.addArticleToDB(article, url, url_md5, user_id, function (err,articleId) {
                            article.close();
                            if (err) {
                                next("(;´༎ຶД༎ຶ`) 臣才疏学浅，无法解析这篇网页！");
                                return;
                            }
                            next("(＝^ω^＝) 陛下，三军列队完毕，请您检阅！/n <a href='http://www.readbox.in/article/read/"+articleId+"'>点此检阅</a>");
                        });
                    });
                }
            }
        });
}

module.exports = service;
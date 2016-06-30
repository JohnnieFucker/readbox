var BaseController = require('../libs/baseController.js');
var controller = new BaseController();
const wechat4u = require('wechat4u');
let wechat = new wechat4u();
var utils =  require('../libs/utils.js');
var Article = require('../models/article.js');
var UserArticle = require('../models/userArticle.js');
var articleService = require('../services/articleService.js');
var readability = require('node-readability');

//首页
controller.index = function(req, res, next){
    res.redirect('/article/readSquare');
};

controller.login = function(req, res, next){
    if(res.session){
        res.session.destroy();
    }
    res.render('common/login');
};

controller.wxbot = function(req, res, next){
    wechat.getUUID().then( (uuid)=>{
        wechat.start();
        startWXMonitor();
        res.render('common/wxlogin',{uuid:uuid});
    });
};
function startWXMonitor(){
    wechat.on('scan', () => {
        console.log('scan');
    });
    wechat.on('confirm', () => {
        console.log('confirm');
    });
    wechat.on('logout', msg => {
        console.log(msg);
    });
    wechat.on('error', err => console.log(err));
    //wechat.on('picture-message', msg => {
    //    console.log(msg);
    //});
    //wechat.on('voice-message', msg => {})
    //wechat.on('emoticon-message', msg => {})
    //wechat.on('verify-message', msg => {
    //    console.log(msg);
    //});
    wechat.on('text-message', msg => {
        dealMsg(msg.content);
    });
    wechat.on('app-message', msg => {
        dealMsg(msg.Url);
    });
}
function dealMsg(url){
    var user_id = "5627902ea23a8c91183eaac1";
    if(utils.checkUrl(message.Content)){
        var url_md5 = utils.md5(url);
        Article.schema.findOne({url_md5: url_md5})
            .select("_id")
            .exec(function (error, result) {
                if (error) {
                    wechat.sendMsg("(;´༎ຶД༎ຶ`) 貌似是服务器被外星人攻占了！",msg.FromUserName);
                } else {
                    if (result) {
                        UserArticle.insertIfNoExist(user_id, result._id, function (err) {
                            if (err) {
                                wechat.sendMsg("(;´༎ຶД༎ຶ`) 貌似是服务器被外星人攻占了！",msg.FromUserName);
                                return;
                            }
                            wechat.sendMsg("(＝^ω^＝) 陛下，三军列队完毕，请您检阅！<a href='http://www.readbox.in/article/read/"+result._id+"'>点此检阅</a>",msg.FromUserName);
                        });
                    } else {
                        readability(url, function (err, article) {
                            articleService.addArticleToDB(article, url, url_md5, user_id, function (err,articleId) {
                                article.close();
                                if (err) {
                                    wechat.sendMsg("(;´༎ຶД༎ຶ`) 臣才疏学浅，无法解析这篇网页！",msg.FromUserName);
                                    return;
                                }
                                wechat.sendMsg("(＝^ω^＝) 陛下，三军列队完毕，请您检阅! <a href='http://www.readbox.in/article/read/"+articleId+"'>点此检阅</a>",msg.FromUserName);
                            });
                        });
                    }
                }
            });
    }else{
        wechat.sendMsg("(;´༎ຶД༎ຶ`) 臣妾实在是做不到啊！",msg.FromUserName);
    }
}
module.exports = controller;
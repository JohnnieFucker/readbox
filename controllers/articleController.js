var BaseController = require('../libs/baseController.js');
var Article = require('../models/article.js');
var utils =  require('../libs/utils.js');
var User = require('../models/user.js');

var _ = require('underscore');
var controller = new BaseController();

//个人阅读列表
controller.list = function(req, res, next){

};
//展示
controller.read = function(req, res, next){
    Article.schema.findById(req.params.articleId,function(error, article){
        if(error) {
            res.render('error', { message: '未找到这篇文章' });
        } else {
            if(article){
                User.schema.findById(article.user_id,function(err,user){
                    if(err) {
                        article.user_name = '已删除用户';
                    }else{
                        article.user_name = user.nickname;
                    }
                    res.render('read/article.ejs',{article:article});

                });
                return;
            }
            res.render('error', { message: '未找到这篇文章' });
        }
    });
};

//广场
controller.readSquare = function(req, res, next){
    var page = req.params.page?req.params.page:1;
    page --;
    var limit = 50;
    var skip = 50 * page;
    Article.schema.find({title:{"$ne":""},content:{"$ne":""}})
        .skip(skip)
        .limit(limit)
        .sort({created:-1})
        .exec(function(error, result) {
            if (error) {
                res.render('error', {message: 'server error'});
                return;
            }
            _.each(result, function (item) {
                item.content = utils.delHtmlTag(item.content);
                item.content = item.content.substr(0, 300);
                item.content = utils.delBlank(item.content);
                if (item.content.length > 100) {
                    item.content = utils.subString(item.content, 100, true);
                }
            });
            res.render('read/article_list.ejs', {articles: result});
        });
};
module.exports = controller;
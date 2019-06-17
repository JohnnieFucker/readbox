const BaseController = require('../libs/baseController.js');
const Article = require('../models/article.js');
const utils = require('../libs/utils.js');
const User = require('../models/user.js');

const _ = require('underscore');

const controller = new BaseController();

// 个人阅读列表
controller.list = function (req, res, next) {

};
// 展示
controller.read = function (req, res, next) {
    Article.schema.findById(req.params.articleId, (error, article) => {
        if (error) {
            res.render('error', { message: '未找到这篇文章' });
        } else {
            if (article) {
                User.schema.findById(article.user_id, (err, user) => {
                    if (err) {
                        article.user_name = '已删除用户';
                    } else {
                        article.user_name = user.nickname;
                    }
                    res.render('read/article.ejs', { article: article });
                });
                return;
            }
            res.render('error', { message: '未找到这篇文章' });
        }
    });
};

// 广场
controller.readSquare = function (req, res, next) {
    let page = req.params.page ? req.params.page : 1;
    page--;
    const limit = 50;
    const skip = 50 * page;
    Article.schema.find({ title: { $ne: '' }, content: { $ne: '' } })
        .skip(skip)
        .limit(limit)
        .sort({ created: -1 })
        .exec((error, result) => {
            if (error) {
                res.render('error', { message: 'server error' });
                return;
            }
            _.each(result, (item) => {
                item.content = utils.delHtmlTag(item.content);
                item.content = item.content.substr(0, 300);
                item.content = utils.delBlank(item.content);
                if (item.content.length > 200) {
                    item.content = utils.subString(item.content, 200, true);
                }
            });
            res.render('read/article_list.ejs', { articles: result });
        });
};
module.exports = controller;

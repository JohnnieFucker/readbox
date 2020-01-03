var BaseService = require('../libs/baseService.js');
var Article = require('../models/article.js');
var UserArticle = require('../models/userArticle.js');
var utils = require('../libs/utils.js');
var _ = require('underscore');
var readability = require('node-readability');
var moment = require('moment');
var toMarkdown = require('to-markdown').toMarkdown;
var URL = require('url');
var service = new BaseService();

function getFavIcon(document, urlObj) {
    var favicon = false;
    var nodeList = document.getElementsByTagName("link");
    for (var i = 0; i < nodeList.length; i++) {
        if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
            favicon = nodeList[i].getAttribute("href");
        }
    }
    if (favicon) {
        if (favicon.indexOf('http') === 0) {

        } else {
            if (favicon.indexOf('/') === 0) {
                favicon = urlObj.protocol + '//' + urlObj.hostname + favicon;
            } else {
                favicon = urlObj.protocol + '//' + urlObj.hostname + '/' + favicon;
            }

        }
    } else {
        favicon = '';
    }
    return favicon;
}

//添加文章
service.add = function (req, res, next) {
    var url = req.body.url;
    var urlObj = URL.parse(url);
    var user_id = req.session.user_id;
    var url_md5 = utils.md5(url);
    var favicon = req.body.favicon || '';
    var html = req.body.html || '';
    var hostname = req.body.hostname;
    var title = req.body.title;
    console.log(url);
    console.log(html);
    Article.schema.findOne({url_md5: url_md5})
        .select("_id")
        .exec(function (error, result) {
            if (error) {
                service.restError(res, next, -1, 'db_error');
            } else {
                if (result) {
                    UserArticle.insertIfNoExist(user_id, result._id, function (err) {
                        if (err) {
                            service.restError(res, -1, err);
                            return;
                        }
                        service.restSuccess(res);
                    });
                } else {
                    if (html !== '') {
                        var newArticle = {
                            hostname: hostname,
                            favico: favicon,
                            title: title,
                            content: html,
                        };
                        addArticleToDB(newArticle, url, url_md5, user_id, function (err) {
                            if (err) {
                                console.log(err);
                                service.restError(res, -1, err);
                                return;
                            }
                            service.restSuccess(res);
                        });
                    } else {
                        readability(url, {
                            headers: {
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                                'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh-TW;q=0.4',
                                'Cache-Control': 'max-age=0',
                                'Connection': 'keep-alive',
                                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
                            },
                            imgCrossDomainConfig:{
                                imgUrlPrefix:'/images/grabed/',
                                imgStorePath:'public/images/grabed/'
                            }
                        }, function (err, article) {
                            article.hostname = hostname;
                            if (favicon === '') {
                                favicon = getFavIcon(article.document, urlObj);
                            }
                            article.favico = favicon;
                            addArticleToDB(article, url, url_md5, user_id, function (err) {
                                article.close();
                                if (err) {
                                    console.log(err);
                                    service.restError(res, -1, err);
                                    return;
                                }
                                service.restSuccess(res);
                            });
                        });
                    }
                }
            }
        });
};

//删除文章
service.del = function (req, res, next) {
    var user_id = req.session.user_id;
    var article_id = req.body.article_id;
    UserArticle.del(user_id, article_id, function (err) {
        if (err) {
            service.restError(res, -1, err);
            return;
        }
        service.restSuccess(res);
    });
};

//获取文章markdown文件
service.createMarkdown = function (req, res, next) {
    var article_id = req.params.articleId;
    Article.schema.findById(article_id, function (error, result) {
        if (error) {
            res.send('操作失败');
            return;
        }
        var content = result.content.toString();
        content = content.replace(/<span>/ig, "");
        content = content.replace(/<\/span>/ig, "");
        content = content.replace(/\n/ig, "");
        var mkContent = toMarkdown(content);

        mkContent = '转载自：[' + result.title + '](' + result.url + ') \n\n' + mkContent;
        res.writeHeader(200, {
            "Content-Type": "application/x-msdownload",
            "Content-Disposition": "attachment;filename=article.md"
        });
        res.write(mkContent);
        res.end();
    });
};

//获取readList
service.getList = function (req, res, next) {
    var page = req.params.page ? req.params.page : 1;
    page--;
    var limit = 50;
    var skip = 50 * page;
    Article.schema.find({title: {"$ne": ""}, content: {"$ne": ""}})
        .skip(skip)
        .limit(limit)
        .sort({created: -1})
        .exec(function (error, result) {
            if (error) {
                service.restError(res, next, -1, 'db_error');
                return;
            }
            _.each(result, function (item) {
                if (item.title.length > 30) {
                    item.title = utils.subString(item.title, 30, true);
                }
                item.content = utils.delHtmlTag(item.content);
                item.content = item.content.substr(0, 300);
                item.content = utils.delBlank(item.content);
                if (item.content.length > 100) {
                    item.content = utils.subString(item.content, 100, true);
                }
            });
            service.restSuccess(res, result);
        });
};

function getList(articleIds, res, next) {
    Article.schema.find({_id: {"$in": articleIds}})
        .sort({created: -1})
        .select("_id title content created")
        .exec(function (error, result) {
            if (error) {
                service.restError(res, next, -1, 'db_error');
                return;
            }
            _.each(result, function (item) {
                if (item.title.length > 30) {
                    item.title = utils.subString(item.title, 30, true);
                }
                item.content = utils.delHtmlTag(item.content);
                item.content = item.content.substr(0, 300);
                item.content = utils.delBlank(item.content);
                if (item.content.length > 100) {
                    item.content = utils.subString(item.content, 100, true);
                }
            });
            service.restSuccess(res, result);
        });
}


function addArticleToDB(article, url, url_md5, user_id, next) {
    if (article && article.title && article.content) {
        var data = new Article.schema({
            user_id: user_id,
            title: article.title,
            content: article.content,
            url: url,
            url_md5: url_md5,
            from_site: article.hostname,
            site_ico: article.favico,
            created: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        data.save(function (err) {
            if (err) {
                next('db_error');
                return;
            }
            UserArticle.insertIfNoExist(user_id, data._id.toString(), function (err) {
                if (err) {
                    next(err);
                    return;
                }
                next(false, data._id.toString());
            });
        });
    } else {
        next('readability_error');
    }
}


module.exports = service;
module.exports.addArticleToDB = addArticleToDB;
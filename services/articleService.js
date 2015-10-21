var BaseService = require('../libs/baseService.js');
var Article = require('../models/article.js');
var UserArticle = require('../models/userArticle.js');
var utils = require('../libs/utils.js');

var readability = require('node-readability');
var moment = require('moment');
var toMarkdown = require('to-markdown').toMarkdown;
var _ = require('underscore');
var _s = require('underscore.string');

var service = new BaseService();

//添加文章
service.add = function (req, res, next) {
    var url = req.body.url;
    var user_id = req.session.user_id;
    var url_md5 = utils.md5(url);
    Article.schema.findOne({url_md5: url_md5})
        .select("_id")
        .exec(function (error, result) {
            if (error) {
                service.restError(res, next, -1, 'db_error');
            } else {
                if (result) {
                    UserArticle.insertIfNoExist(user_id, result._id, function (err) {
                        if (err) {
                            service.restError(res, next, -1, err);
                            return;
                        }
                        service.restSuccess(res, next);
                    });
                } else {
                    readability(url, function (err, article) {
                        addArticleToDB(article, url, url_md5, user_id, function (err) {
                            article.close();
                            if (err) {
                                service.restError(res, next, -1, err);
                                return;
                            }
                            service.restSuccess(res, next);
                        });
                    });
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
            service.restError(res, next, -1, err);
            return;
        }
        service.restSuccess(res, next);
    });
};

//获取文章markdown文件
service.createMarkdown = function (req, res, next) {
    var article_id = req.params.article_id;
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
    //var redis = this.redis;
    //var time_stamp = req.params.time_stamp;
    //var articleIds = [];
    //if (time_stamp == 0) {
    //    redis.ZRANGE()
    //}
    //
    //getList(articleIds,res,next);
};

function getList(articleIds,res,next){
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
                    item.title = subString(item.title, 30, true);
                }
                item.content = delHtmlTag(item.content);
                item.content = item.content.substr(0, 300);
                item.content = delBlank(item.content);
                if (item.content.length > 100) {
                    item.content = subString(item.content, 100, true);
                }
            });
            service.restSuccess(res, next,result);
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
                next(false);
            });
        });
    } else {
        next('readability_error');
    }
}

function subString(str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        } else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += "...";
    }
    return newStr;
}
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
}
function delBlank(str) {
    var _tmp = str.replace(/\t/g, "");//把所有/t替换掉
    _tmp = _tmp.replace(/\r/g, "");//把所有/r替换掉
    _tmp = _s.trim(_tmp, ' \n');//把前后的换行替换掉
    _tmp = _s.trim(_tmp, '\n ');//把前后的换行替换掉
    _tmp = _s.trim(_tmp, '\n');//把前后的换行替换掉
    return _tmp;

}

module.exports = service;
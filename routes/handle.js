var express = require('express');
var router = express.Router();
var readability = require('node-readability');
var moment = require('moment');
var mongoose = require('../libs/mongoose.js');
var toMarkdown = require('to-markdown').toMarkdown;
var _ = require('underscore');
var _s = require('underscore.string');

router.post('/addPage', function (req, res) {
    var url = req.body.url;
    var user_id = req.body.user_id;
    readability(url, function (err, article) {
        addArticleToDB(article, url,user_id, function (result) {
            article.close();
            if (result) {
                res.send('{"result":"TRUE"}');
            } else {
                res.send('{"result":"FALSE"}');
            }
        });
    });
});
router.post('/delPage', function (req, res) {
    var page_id = req.body.page_id;
    var articleModel = require('../models/article.js');
    articleModel.remove({_id:page_id},function (err) {
        if (err) {
            console.log(err);
            res.send('{"result":"FALSE"}');
            return;
        }
        res.send('{"result":"TRUE"}');
    });
});
router.get('/addPage/:url/:uid', function (req, res) {
    var url = decodeURIComponent(req.params.url);
    var user_id = req.params.uid;
    readability(url, function (err, article) {
        addArticleToDB(article, url,user_id, function (result) {
            article.close();
            if (result) {
                res.send('{"result":"TRUE"}');
            } else {
                res.send('{"result":"FALSE"}');
            }
        });
    });
});
router.get('/createMarkdown/:article_id', function (req, res) {
    var articleModel = require('../models/article.js');
    articleModel.findById(req.params.article_id,function(error, result){
        if(error) {
            res.send('操作失败');
            return false;
        } else {
            var content = result.content.toString();
            content = content.replace(/<span>/ig, "");
            content = content.replace(/<\/span>/ig, "");
            content = content.replace(/\n/ig, "");
            var mkContent = toMarkdown(content);

            mkContent = '转载自：['+result.title+']('+result.url+') \n\n' + mkContent;

            res.writeHeader(200, {
                "Content-Type": "application/x-msdownload",
                "Content-Disposition":"attachment;filename=article.md"
            });
            res.write(mkContent);
            res.end();
        }
    });
});
router.get('/getList/:time_stamp',function(req,res){
    var articleModel = require('../models/article.js');
    articleModel.find({created:{"$gt":req.params.time_stamp}})
        .sort({created:-1})
        .select("_id title content created")
        .exec(function(error, result){
            if(error) {
                res.send('{"result":"false","err":"db_error"}');
            } else {
                _.each(result,function(item){
                   if(item.title.length >30){
                       item.title = subString(item.title,30,true);
                   }
                   item.content = delHtmlTag(item.content);
                   if(item.content.length>100){
                       item.content =  subString(item.content,100,true);
                   }
                });
                var returnObj = {
                    result:"true",
                    data:result
                };
                res.send(JSON.stringify(returnObj));
            }
        });
});
function addArticleToDB(article, url,user_id, cb) {
    var articleModel = require('../models/article.js');
    if(article&&article.title&&article.content){
        var data = new articleModel({
            user_id:user_id,
            title: article.title,
            content: article.content,
            url: url,
            created: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        data.save(function (err) {
            if (err) {
                console.log(err);
                cb(false);
                return;
            }
            cb(true);
        });
    }else{
        cb(false);
    }

}
function subString(str, len, hasDot)
{
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex,"**").length;
    for(var i = 0;i < strLength;i++){
        singleChar = str.charAt(i).toString();
        if(singleChar.match(chineseRegex) != null){
            newLength += 2;
        }else{
            newLength++;
        }
        if(newLength > len){
            break;
        }
        newStr += singleChar;
    }

    if(hasDot && strLength > len){
        newStr += "...";
    }
    return newStr;
}
function delHtmlTag(str){
    return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}

module.exports = router;
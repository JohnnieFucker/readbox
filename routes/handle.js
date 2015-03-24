var express = require('express');
var router = express.Router();
var readability = require('node-readability');
var moment = require('moment');
var mongoose = require('../libs/mongoose.js');
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
function addArticleToDB(article, url,user_id, cb) {
    var articleModel = require('../models/article.js');
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
}

module.exports = router;
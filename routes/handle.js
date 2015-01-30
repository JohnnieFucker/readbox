var express = require('express');
var router = express.Router();
var readability = require('node-readability');
var moment = require('moment');
var mongoose = require('../libs/mongoose.js');
router.post('/addPage', function (req, res) {
    var url = req.body.url;
    readability(url, function (err, article) {
        addArticleToDB(article, url, function (result) {
            article.close();
            if (result) {
                res.send('{"result":"TRUE"}');
            } else {
                res.send('{"result":"FALSE"}');
            }
        });
    });
});
router.get('/addPage/:url', function (req, res) {
    var url = decodeURIComponent(req.params.url);
    readability(url, function (err, article) {
        addArticleToDB(article, url, function (result) {
            article.close();
            if (result) {
                res.send('{"result":"TRUE"}');
            } else {
                res.send('{"result":"FALSE"}');
            }
        });
    });
});
function addArticleToDB(article, url, cb) {
    var articleModel = require('../models/article.js');
    var data = new articleModel({
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
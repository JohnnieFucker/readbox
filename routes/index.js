var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose.js');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});
router.get('/read/:articleId',function(req,res){
    var articleModel = require('../models/article.js');
    articleModel.findById(req.params.articleId,function(error, result){
        if(error) {
            console.log(error);
            res.render('error', { message: '未找到这篇文章' });
        } else {
            res.render('read/article.ejs',{article:result});
        }
    });
});

module.exports = router;

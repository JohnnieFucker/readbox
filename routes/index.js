'use strict';
var BaseRouter = require('../libs/baseRoute');
var handler = require('../services/userService.js');

var services = [];
//登录接口
services.push({
    type:'post',
    url:'/login',
    handler:handler.login
});

class Router extends BaseRouter{
    constructor(server,name,config) {
        super(server,name,config);
        this.services = services;
    }
}
module.exports = Router;


///* GET home page. */
//router.get('/', function(req, res) {
//  res.redirect('/readbox/52037282f5b7879676000004');
//});
//
//router.get('/read/:articleId',function(req,res){
//    var articleModel = require('../models/article.js');
//    articleModel.findById(req.params.articleId,function(error, result){
//        if(error) {
//            res.render('error', { message: '未找到这篇文章' });
//        } else {
//            if(result){
//                res.render('read/article.ejs',{article:result});
//            }
//            res.render('error', { message: '未找到这篇文章' });
//        }
//    });
//});
//router.get('/readbox/:user_id',function(req,res){
//    var articleModel = require('../models/article.js');
//    articleModel.find({user_id:req.params.user_id})
//        .sort({created:-1})
//        .select("_id title")
//        .exec(function(error, result){
//        if(error) {
//            console.log(error);
//            res.render('error', { message: 'DB错误' });
//        } else {
//            res.render('read/article_list.ejs',{articles:result});
//        }
//    });
//});
//
//module.exports = router;

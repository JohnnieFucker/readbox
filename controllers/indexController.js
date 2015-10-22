var BaseController = require('../libs/baseController.js');
var controller = new BaseController();

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
module.exports = controller;
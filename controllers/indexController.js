var BaseController = require('../libs/baseController.js');
var controller = new BaseController();

//首页
controller.index = function(req, res, next){
    res.redirect('/article/readSquare');
};

module.exports = controller;
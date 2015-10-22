var BaseService = require('../libs/baseService.js');
var User = require('../models/user.js');
var jwtHandler = require('../libs/jwtHandler.js');
var utils =  require('../libs/utils.js');

var service = new BaseService();

//登录
service.login = function(req, res, next){
    var loginName = req.body.loginName;
    var pwd = req.body.pwd;
    var wxUid = req.body.wxUid;
    User.schema.findOne({ "$or":[{phone:loginName},{email:loginName}]}).exec(function (err, result) {
        if (err) {
            return service.restError(res,-1,'db_error');
        }
        if (result) {
            pwd = utils.base64_decode(pwd);
            pwd = utils.generatePass(pwd);
            if(result.pwd==pwd){
                delete(result.pwd);
                req.session.user_id = result._id.toString();
                if(wxUid){
                   this.redis.set('wxuid:'+wxUid,result._id.toString(),function(e,r){});
                }
                jwtHandler.getJWT(result._id.toString(),function(jwt){
                    service.restSuccess(res,result,{jwt:jwt});
                });

            }
        }else{
            service.restError(res,-1,'db_error');
        }
    });
};

//登录
service.register = function(req, res, next){
    var loginName = req.body.loginName;
    var pwd = req.body.pwd;
    var nickName = req.body.nickname;
    pwd = utils.base64_decode(pwd);
    pwd = utils.generatePass(pwd);
    var wxUid = req.body.wxUid;
    User.schema.findOne({ "$or":[{phone:loginName},{email:loginName},{nickname:nickName}]}).exec(function (err, result) {
        if (err) {
            return service.restError(res,-1,'db_error');
        }
        if (result) {
            service.restError(res,-1,'user exist');
        }else{
            var email ='';
            var phone ='';
            if(utils.checkEmail(loginName)){
                email = loginName;
            }
            if(utils.checkPhone(loginName)){
                phone = loginName;
            }
            if(email==''&&phone ==''){
                service.restError(res,-1,'loginname error');
            }
            var newUser = new User.schema({
                nickname:nickName,
                pwd: pwd,
                email:email,
                phone:phone,
                created: utils.datetimeFormat(),
                modified: utils.datetimeFormat()
            });
            newUser.save(function (err,result) {
                if (err) {
                    //console.log(err);
                    service.restError(res,-1,'db_error');
                    return;
                }
                if(wxUid){
                    this.redis.set('wxuid:'+wxUid,result._id.toString(),function(e,r){});
                }
                req.session.user_id = result._id.toString();
                jwtHandler.getJWT(result._id.toString(),function(jwt){
                    service.restSuccess(res,result,{jwt:jwt});
                });
            });
        }
    });
};

module.exports = service;
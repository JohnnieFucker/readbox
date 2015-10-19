var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var utils = require('./libs/utils.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/fav.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var importer = require('./libs/importer')(__dirname);
var sysConfig = importer(utils.configDir);

var jwtHandler = require('./libs/jwtHandler.js');

//鉴权拦截
app.use(function(req, res, next){
    if(utils.env != 'production'){
        console.log(req.url + '  [params]:' + JSON.stringify(req.params));
    }
    var whiteList = sysConfig.serverConfig.whiteList;
    for(var e of whiteList){
        if(req.url === e){
            return next();
        }
    }
    jwtHandler.checkJWT(req, function(isAuth){
        if(!isAuth){
            var err = new Error('No Auth');
            err.status = 500;
            next(err);
        }
        next();
    });
});

//加载路由
var routes = importer('../routes');
for(var key in routes){
    var routeClass = routes[key];
    var routeInstance = new routeClass(server, key, sysConfig);
    routeInstance.initRouter();
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error.ejs', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error.ejs', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

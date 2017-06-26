var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var loader = require('./libs/loadConfig.js');
var compression = require('compression');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var partials = require('express-partials');
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/fav.ico'));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var importer = require('./libs/importer')();
var sysConfig = require(loader.configFile)[loader.projectName];

app.use(session({
    secret: sysConfig.sessionConfig.secret,
    store: new RedisStore({
        host: sysConfig.redis.jwtServer.host,
        port: sysConfig.redis.jwtServer.port,
        ttl: sysConfig.sessionConfig.maxAge
    }),
    cookie: {maxAge: sysConfig.sessionConfig.maxAge,secure: false},
    resave: false,
    saveUninitialized: true
}));


var jwtHandler = require('./libs/jwtHandler.js');

//鉴权拦截
app.use(function(req, res, next){
    if(loader.env != 'production'){
        console.log(req.url + '  [params]:' + JSON.stringify(req.params)+'[body]:' + JSON.stringify(req.body));
    }
    var whiteList = sysConfig.whiteList;
    for(var item of whiteList){
        var urlArr = req.path.split('/');
        var itemArr = item.split('/');
        if(urlArr.length==itemArr.length){
            var isMate = true;
            for(var i=0;i<urlArr.length;i++){
                if(itemArr[i]==='*'||urlArr[i]===itemArr[i]){

                }else{
                    isMate= false;
                    break;
                }
            }
            if(isMate){
                return next();
            }
        }
    }
    jwtHandler.checkJWT(req, function(isAuth){
        if(!isAuth){
            res.redirect('/login');
            return;
        }
        next();
    });
});

//加载路由
var routes = importer('./routes');
for(var key in routes){
    var routeClass = routes[key];
    var routeInstance = new routeClass(app,key, sysConfig);
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

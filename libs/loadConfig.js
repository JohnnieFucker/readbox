var fs = require('fs'),
    path = require('path');
var projectName = require('../process.json').apps[0].name;
var loader = {};
loader.env = (function () {
    return !process.env.NODE_ENV ? 'development' : process.env.NODE_ENV;
})();

loader.configDir = (function () {
    var env = !process.env.NODE_ENV ? 'development' : process.env.NODE_ENV;
    var path = process.cwd() + '/config.dev/';
    if (env === 'production') {
        path = process.cwd() + '/../tsb-server-config/';
    }
    return path;
})();

loader.configFile = (function () {
    var env = !process.env.NODE_ENV ? 'development' : process.env.NODE_ENV;
    var path = process.cwd() + '/config.dev/config.json';
    if (env === 'production') {
        path = process.cwd() + '/../tsb-server-config/config.json';
    }
    return path;
})();
loader.projectName = projectName;

module.exports = loader;
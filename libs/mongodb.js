var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);
var util = require('./utils.js');

var mongoConfig = require(util.configDir + '/mongodbConfig.json').dataServer;
mongoose.connect('mongodb://' + mongoConfig.user + ':' + mongoConfig.pwd + '@' + mongoConfig.host + ':' + mongoConfig.port + '/' + mongoConfig.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose;
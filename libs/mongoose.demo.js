/*
edit this file to mongoose.js
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://dbuser:dbpassword@dbip/Article');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
module.exports = mongoose;
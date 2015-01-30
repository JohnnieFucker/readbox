var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
    user_id:String,
    nickname:String,
    title: String,
    content: String,
    url: String,
    created: String
},{versionKey: false});

module.exports = mongoose.model('Article', ArticleSchema);
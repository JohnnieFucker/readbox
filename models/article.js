var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
    user_id:String,
    title: String,
    content: String,
    url: String,
    url_md5:String,
    created: String
},{versionKey: false});

var Model = {
    schema: mongoose.model('articles', ArticleSchema)
};

module.exports = Model;
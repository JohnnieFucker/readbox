var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    nickname: String,
    pwd: String,
    email: String,
    phone: String,
    avatar: String,
    other_info: Object,
    created: String,
    modified: String
},{versionKey: false});

var Model = {
    schema: mongoose.model('users', UserSchema)
};

module.exports = Model;
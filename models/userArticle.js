var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;
var UserArticleSchema = new Schema({
    user_id: String,
    article_id: String,
    created: String
}, {versionKey: false});

var redis = require('../libs/redis.js');
var moment = require('moment');

var Model = {
    schema: mongoose.model('user_articles', UserArticleSchema),
    insertIfNoExist: function (user_id, article_id, next) {
        var readListKey = 'readlist:'+user_id;
        var schema = this.schema;
        var now = moment().format('X');
        schema.findOne({user_id: user_id, article_id: article_id}).exec(function (err, result) {
            if (err) {
                next('db_error');
                return;
            }
            if (result) {
                redis.redisClient.zadd(readListKey,now,article_id);
                redis.redisClient.ZREMRANGEBYRANK(readListKey,0, -101);
                next(false);
            } else {
                var item = new schema({
                    user_id: user_id,
                    article_id: article_id,
                    created: now
                });
                item.save(function (err) {
                    if (err) {
                        next('db_error');
                        return;
                    }
                    redis.redisClient.zadd(readListKey,now,article_id);
                    redis.redisClient.ZREMRANGEBYRANK(readListKey,0, -101);
                    next(false);
                });
            }
        });
    },
    del: function (user_id, article_id, next) {
        var readListKey = 'readlist:'+user_id;
        var schema = this.schema;
        schema.remove({user_id: user_id, article_id: article_id}).exec(function (err, result) {
            if (err) {
                next('db_error');
                return;
            }
            redis.redisClient.ZREM(readListKey,article_id);
            redis.redisClient.ZREMRANGEBYRANK(readListKey,0, -101);
            next(false);
        });
    }
};

module.exports = Model;
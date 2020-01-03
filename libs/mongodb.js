const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

Promise.promisifyAll(mongoose);
const loader = require('./loadConfig');

const mongoConfig = require(loader.configFile)[loader.projectName].mongodb; // eslint-disable-line

let connectStr = 'mongodb://';
if (mongoConfig.replication) {
    if (mongoConfig.user) {
        connectStr += `${mongoConfig.user}:${mongoConfig.pwd}@`;
    }
    mongoConfig.servers.forEach((server) => {
        connectStr += `${server.host}:${server.port},`;
    });
    connectStr = connectStr.substring(0, connectStr.length - 1);
    connectStr += `/${mongoConfig.db}?replicaSet=${mongoConfig.replication}`;
} else if (mongoConfig.user) {
    connectStr += `${mongoConfig.user}:${mongoConfig.pwd}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.db}`;
} else {
    connectStr += `${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.db}`;
}
// connectStr += `?authSource=${mongoConfig.db}`;
console.log(connectStr);
mongoose.connect(connectStr, {
    useNewUrlParser: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
}).catch((e) => {
    console.error(e);
});

module.exports = mongoose;

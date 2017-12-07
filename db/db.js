const mongoose = require('mongoose');
const logger = require('../logging/logger');
const config = require('../config/develop');
const autoIncrement = require('mongoose-auto-increment');

mongoose.connect(config.url, {useMongoClient: true});
const db = mongoose.connection;
autoIncrement.initialize(db);
mongoose.Promise = global.Promise;

db.once('open', () => {
    logger.info('Connected with DB');
    logger.trace(db);
    console.log('Connected with DB');
})

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', function () {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(config.url, {server: {auto_reconnect: true}});
});

// 3、通过`mongoose.model`定义模型(model)

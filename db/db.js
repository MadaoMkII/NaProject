let mongoose = require('mongoose');
let config = require('../config/develop');
let autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
mongoose.connect(config.url, {useMongoClient: true});

const db = mongoose.connection;
//autoIncrement.initialize(mongoose.connection);
autoIncrement.initialize(db);
db.once('open', () => {
    console.log('连接数据库成功')
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

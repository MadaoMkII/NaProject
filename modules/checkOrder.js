let mongoose = require('mongoose');
let db = require('../db/db');
var dateFormat = require('dateformat');

const autoIncrement = require('mongoose-auto-increment');
const checkFormSchema = new mongoose.Schema({
    adStatus: String, adName: String, adBeginDate: Date, adEndDate: Date,
    receivePosition: String, publishPosition: String, customerWechat: String,
    orderAmont: Number, remark: String
}, {'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}});

checkFormSchema.plugin(autoIncrement.plugin, {model: 'checkForm', field: 'checkOrderId'});
const checkFormModel = mongoose.model('checkForm', checkFormSchema);
module.exports = checkFormModel;
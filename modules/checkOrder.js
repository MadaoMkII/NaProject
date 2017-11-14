let mongoose = require('mongoose');
let db = require('../db/db');

const checkFormSchema = new mongoose.Schema({
    adStatus: String, adName: String, adBeginDate: Date, adEndDate: Date,
    receivePosition: String, publishPosition: String, dealerWechat: String,
    orderTotalPaidAmont: Number, remark: String
}, {'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}});


const checkFormModel = mongoose.model('checkForm', checkFormSchema);
module.exports = checkFormModel;
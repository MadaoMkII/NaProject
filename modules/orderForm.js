let mongoose = require('mongoose');
let db = require('../db/db');

const orderFormSchema = new mongoose.Schema({
    adName: String, adType: String,
    adBeginDate: Date, adEndDate: Date,
    spreadType: String, spreadAmount: Number,
    draweeName: String, paymentMethod: String,
    receivePosition: String, publishPositions: [],
    dealerWechat: String, dealerPhone: String,
    remark: String, adContinue: Boolean
}, {'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}});

let orderFormModel = mongoose.model('orderForm', orderFormSchema);

module.exports = orderFormModel;




const mongoose = require('mongoose');
const db = require('../db/db');
let autoIncrement = require('mongoose-auto-increment');
const orderFormSchema = new mongoose.Schema({
    adName: String, adType: String,
    adBeginDate: Date, adEndDate: Date,
    spreadType: String, orderTotalAmont: Number,
    customerName: String, paymentMethod: String,
    receivePosition: String, publishPositions: [],
    customerWechat: String, customerPhone: String,
    remark: String, adContinue: Boolean
}, {'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}});

orderFormSchema.plugin(autoIncrement.plugin, {model: 'orderForm', field: 'orderId'});
let orderFormModel = mongoose.model('orderForm', orderFormSchema);

module.exports = orderFormModel;




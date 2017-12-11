const mongoose = require('mongoose');
const db = require('../db/db');
let autoIncrement = require('mongoose-auto-increment');

const publisStation = new mongoose.Schema(
    {
        stationname: String,
        amount: Number,
        currency: String
    }
);
//
//
// x新功能 1，注册agent 2,logout
//
// {
//     type: 'received' : 'publish',
//     agent: 'tutu',
//     status: 'paid', 'approved' etc
//     beginDateRange: {datestamp, datestamp},
//     endDateRange: {datestamp, datestamp},
//     range: {10-20},
//     sortBy: 'desc' or 'asec'
}
const paymentHistory = new mongoose.Schema({
        paymentDate: Date,
        paymentAmount: Number
    }
);
const paymentHistoryModel = mongoose.model('paymentHistory', paymentHistory);
const checkFormSchema = new mongoose.Schema({
    adName: String, adBeginDate: Date, adEndDate: Date,
    receiveStation: {required: true, type: String}, shouldPayStation: {required: true, type: String},
    customerWechat: String,
    paymentHistories: [paymentHistory],
    job: String,
    currency: String,
    orderAmont: {
        type: Number,
        required: true
    }, remark: String
}, {'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}});
const checkFormModel = mongoose.model('checkOrderForm', checkFormSchema);
const orderFormSchema = new mongoose.Schema({
    adName: String,
    adType: String,
    adStatus: String,
    adBeginDate: Date,
    adEndDate: Date,
    publishType: String,
    orderTotalAmont: {required: true, type: Number},
    customerName: String,
    paymentMethod: String,
    receivePosition: {required: true, type: String},
    publishPositions: [publisStation],
    customerWechat: String,
    customerPhone: String,
    remark: String,
    adContinue: Boolean,
    checkOrderRecords: [checkFormSchema]
}, {'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}});

orderFormSchema.plugin(autoIncrement.plugin, {model: 'orderForm', field: 'orderId'});
const orderFormModel = mongoose.model('orderForm', orderFormSchema);
orderFormSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};
module.exports.orderFormModel = orderFormModel;
module.exports.checkFormModel = checkFormModel;
module.exports.paymentHistoryModel = paymentHistoryModel;


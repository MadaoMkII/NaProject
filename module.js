const mongoose = require('mongoose');
const db = require('./db/db');
const orderModel = require('./modules/orderForm').orderFormModel;


orderModel.update({
    'checkOrderRecords.paymentHistories._id': '5a1e8eda47e5122524c73158'
}, {$set: {'checkOrderRecords.paymentHistories.$.paymentAmount': 12}}, false,
     (err, data) => {

    console.log(data)

});
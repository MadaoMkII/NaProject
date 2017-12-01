const angentModel = require('../modules/agent');
const orderModel = require('../modules/orderForm').orderFormModel;


exports.getOrderForm = (req, res) => {
    orderModel.find({}, {__v: 0, updated_at: 0, created_at: 0}, (err, data) => {
            if (err) {
                return res.status(406).send({success: false, message: 'Not Successed Saved'});
            } else {
                return res.status(200).send({success: true, message: 'Successed Saved', orderform: data});
            }
        }
    );
};
exports.getOrderFormByCheckId = (req, res) => {//未检查
    orderModel.find({'checkOrderRecords._id': {$eq: req.body.checkOrderId}}, {
        __v: 0,
        updated_at: 0,
        created_at: 0
    }, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(406).send({success: false, message: 'Not Successed Saved'});
        } else {
            return res.status(200).send({success: true, orderForm: data});
        }
    });
};
exports.getOrderFormByDates = (req, res) => {

    orderModel.find({created_at: {$lt: new Date(req.body['beforeDate']), $gt: new Date(req.body['afterDate'])}}, {
            _id: 0,
            __v: 0,
            updated_at: 0,
            created_at: 0
        }, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(406).send({success: false, message: 'Not Successed Saved'});
            } else {
                return res.status(200).send({success: true, orderForm: data});
            }
        }
    );
};
exports.addOrderForm = (req, res) => {

    let orderInformation = req.body;
    let flag = false;
    let publishPositions = orderInformation.publishPositions;

    if (publishPositions.includes(orderInformation.receivePosition)) {
        flag = true;
    } else {
        publishPositions.push(orderInformation.receivePosition);
    }
    let tempNumber = publishPositions.length;
    let orderForm = new orderModel();

    {
        orderForm.adName = orderInformation.adName;
        orderForm.adType = orderInformation.adType;
        orderForm.adBeginDate = orderInformation.adBeginDate;
        orderForm.adEndDate = orderInformation.adEndDate;
        orderForm.publishType = orderInformation.publishType;
        orderForm.orderTotalAmont = orderInformation.orderTotalAmont;
        orderForm.customerName = orderInformation.customerName;
        orderForm.paymentMethod = orderInformation.paymentAmount;
        orderForm.receivePosition = orderInformation.receivePosition;
        orderForm.publishPositions = orderInformation.publishPositions;
        orderForm.customerWechat = orderInformation.customerWechat;
        orderForm.customerPhone = orderInformation.customerPhone;
        orderForm.remark = orderInformation.remark;
        orderForm.adContinue = orderInformation.adContinue;
        orderForm.checkOrderRecords = [];
    }
    {
        if (!(null !== publishPositions && Array.isArray(publishPositions))) {


        } else {
            angentModel.findByPositionName(publishPositions, (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(503).send({success: false, message: 'Error happen when adding to DB'});
                }
                result.forEach((element) => {
                    let shouldPay, checkOrder;
                    if (flag || element.stationname !== orderInformation.receivePosition) {
                        shouldPay = Math.round(orderInformation.orderTotalAmont
                            / tempNumber * element.publishrate * 100) / 100;

                        checkOrder = {
                            adStatus: 'Ongoing',
                            job: 'publish',
                            adName: orderInformation.adName,
                            adBeginDate: orderInformation.adBeginDate,
                            adEndDate: orderInformation.adEndDate,
                            receiveStation: orderInformation.receivePosition,
                            shouldPayStation: element.stationname,
                            customerWechat: orderInformation.customerWechat,
                            orderAmont: shouldPay,
                            remark: orderInformation.remark
                        };

                        orderForm.checkOrderRecords.push(checkOrder);
                    }
                    if (element.stationname === orderInformation.receivePosition) {
                        let shouldPay = Math.round(orderInformation.orderTotalAmont
                            * element.receiverate * 100) / 100;

                        let checkOrder = {
                            adStatus: 'Ongoing',
                            job: 'receive',
                            adName: orderInformation.adName,
                            adBeginDate: orderInformation.adBeginDate,
                            adEndDate: orderInformation.adEndDate,
                            receiveStation: orderInformation.receivePosition,
                            shouldPayStation: orderInformation.receivePosition,
                            customerWechat: orderInformation.customerWechat,
                            orderAmont: shouldPay,
                            remark: orderInformation.remark
                        };

                        orderForm.checkOrderRecords.push(checkOrder);

                    }
                });
                orderForm.save((err, data) => {
                    if (err) {
                        res.status(503).send({
                            success: false,
                            message: 'Error Happened , please check input data!'
                        });
                    } else {
                        console.log(data);
                        res.status(200).send({success: true, message: 'Successed Saved'});
                    }
                });

            })
        }
    }
};
exports.payAmount = (req, res) => {

    let paymentElement = {};
    paymentElement._id = req.body['checkOrderId'];
    paymentElement.paymentDate = req.body['payDay'];
    paymentElement.paymentAmount = req.body['paymentAmount'];
    console.log(paymentElement);
    orderModel.update({
            'checkOrderRecords._id': paymentElement._id
        }, {
            $push: {
                'checkOrderRecords.$.paymentHistories': {
                    paymentDate: paymentElement.paymentDate,
                    paymentAmount: paymentElement.paymentAmount
                }
            }
        }, (err, data) => {
            if (err) {
                console.log(err);
                res.status(503).send({
                    success: false,
                    message: 'Error Happened , please check input data!'
                });
            } else {
                console.log(data);
                res.status(200).send({success: true, message: 'Successed Saved'});
            }
        }
    );
};
exports.updatePayment = (req, res) => {

    let paymentElement = {};
    paymentElement.checkOrderId = req.body['checkOrderId'];
    paymentElement.paymentId = req.body['paymentId'];
    paymentElement.paymentDate = req.body['payDay'];
    paymentElement.paymentAmount = req.body['paymentAmount'];

    orderModel.update({
            'checkOrderRecords._id': paymentElement.checkOrderId
        }, {
            $pull: {
                'checkOrderRecords.$.paymentHistories': {'_id': {$eq: paymentElement.paymentId}}
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return res.status(503).send({
                    success: false,
                    message: 'Error Happened , please check input data!'
                });
            } else {
                orderModel.update({
                    'checkOrderRecords._id': paymentElement.checkOrderId
                }, {
                    $push: {
                        'checkOrderRecords.$.paymentHistories': {
                            _id: paymentElement.paymentId,
                            paymentDate: paymentElement.paymentDate,
                            paymentAmount: paymentElement.paymentAmount
                        }
                    }
                }, (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(503).send({
                            success: false,
                            message: 'Error Happened , please check input data!'
                        });
                    } else {
                        console.log(data);
                        return res.status(200).send({success: true, message: 'Successed Saved'});
                    }
                });
            }
        }
    );
};
exports.deletePayment = (req, res) => {

    let paymentElement = {};
    paymentElement.paymentId = req.body['paymentId'];

    orderModel.update({
        'checkOrderRecords._id': paymentElement.checkOrderId
    }, {
        $pull: {
            'checkOrderRecords.$.paymentHistories': {'_id': {$eq: paymentElement.paymentId}}
        }
    }, (err) => {
        if (err) {
            console.log(err);
            return res.status(503).send({
                success: false,
                message: 'Error Happened , please check input data!'
            });
        } else {
            console.log(data);
            return res.status(200).send({success: true, message: 'Successed Deleted'});
        }
    });
};




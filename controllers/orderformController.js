const angentModel = require('../modules/agent');
const orderModel = require('../modules/orderForm').orderFormModel;
const logger = require('../logging/logger');
//S1 接的广告
// Total S1+S2+S3 = 600
//
// receiveposition S1= total * 20%
//
//     Publish position s1, s2, s3
// agent 加入币种
// s1pub =(S1 :250) * 0.5
// s2pub =(S2 :200) * 0.5
// s3pub =(S3 :150) * 0.5
// S1 :250: currency


exports.getMyPublishOrderform = (req, res) => {

    orderModel.find({'publishPositions.stationname': {$eq: req.user.stationname}}, {
            __v: 0
        }, (err, data) => {
            if (err) {
                logger.info(req.body);
                logger.error('Error location : Class: orderformController, function: getOrderForm. ' + err);
                logger.error('Response code:406, message: Not Successed Saved');
                return res.status(406).send({success: false, message: 'Not Successed Saved'});
            } else {
                return res.status(200).send({success: true, message: 'Successed Saved', orderform: data});
            }
        }
    );
};

exports.getMyreceiveOrderform = (req, res) => {

    orderModel.find({'receivePosition': {$eq: req.user.stationname}}, {
            __v: 0
        }, (err, data) => {
            if (err) {
                logger.info(req.body);
                logger.error('Error location : Class: orderformController, function: getOrderForm. ' + err);
                logger.error('Response code:406, message: Not Successed Saved');
                return res.status(406).send({success: false, message: 'Not Successed Saved'});
            } else {

                return res.status(200).send({success: true, message: 'Successed Saved', orderform: data});
            }
        }
    );
};

exports.getOrderForm = (req, res) => {
    orderModel.find({}, {__v: 0, updated_at: 0, created_at: 0}, (err, data) => {
            if (err) {
                logger.info(req.body);
                logger.error('Error location : Class: orderformController, function: getOrderForm. ' + err);
                logger.error('Response code:406, message: Not Successed Saved');
                return res.status(406).send({success: false, message: 'Not Successed Saved'});
            } else {
                return res.status(200).send({success: true, message: 'Successed Saved', orderform: data});
            }
        }
    );
};

exports.getOrderFormByCheckId = (req, res) => {//Done

    let id = req.query._id;
    orderModel.find({'checkOrderRecords._id': {$eq: id}}, {
        __v: 0,
        updated_at: 0,
        created_at: 0
    }, (err, data) => {
        if (err) {
            logger.info(req.body);
            logger.error('Error location : Class: orderformController, function: getOrderFormByCheckId. ' + err);
            logger.error('Response code:406, message: Not Successed Saved');
            return res.status(406).send({success: false, message: 'Not Successed Saved'});
        } else {
            return res.status(200).send({success: true, orderForm: data});
        }
    });
};
exports.getOrderFormByDates = (req, res) => {

    orderModel.find({created_at: {$lt: new Date(req.body['beforeDate']), $gt: new Date(req.body['afterDate'])}}, {
            __v: 0,
            updated_at: 0,
            created_at: 0
        }, (err, data) => {
            if (err) {
                logger.info(req.body);
                logger.error('Error location : Class: orderformController, function: getOrderFormByDates. ' + err);
                logger.error('Response code:406, message: Not Successed Saved');
                return res.status(406).send({success: false, message: 'Not Successed Saved'});
            } else {
                return res.status(200).send({success: true, orderForm: data});
            }
        }
    );
};
exports.updateOrderForm = (req, res) => {
    if (req.body['rebuilt']) {
        orderModel.remove({_id: req.body['_orderformid']}, (err) => {
            if (err) {
                logger.info(req.body);
                logger.error('Error location : Class: orderformController, function: updateOrderForm. ' + err);
                logger.error('Response code:406, message: Not Successed Saved');
                return res.status(406).send({success: false, message: 'Not Successed Saved'});
            } else {
                addOrderForm(req, res);
            }
        });
    } else {
        orderModel.update({_id: req.body['_orderformid']}, {
                $set: {
                    adStatus: req.body.adStatus,
                    adType: req.body.adType,
                    adName: req.body.adName,
                    adBeginDate: req.body.adBeginDate,
                    adEndDate: req.body.adEndDate,
                    publishType: req.body.publishType,
                    customerName: req.body.customerName,
                    paymentMethod: req.body.paymentMethod,
                    customerWechat: req.body.customerWechat,
                    customerPhone: req.body.customerPhone,
                    remark: req.body.remark,
                    orderTotalAmont: req.body.orderTotalAmont
                }
            },
            (err) => {
                if (err) {
                    logger.info(req.body);
                    logger.error('Error location : Class: orderformController, function: updateOrderForm. ' + err);
                    logger.error('Response code:406, message: Not Successed Saved');
                    return res.status(406).send({success: false, message: 'Not Successed Saved'});
                } else {

                    return res.status(200).send({success: true, message: 'Successed Updated'});
                }
            }
        );
    }
};
let addOrderForm = (req, res) => {

    let orderInformation = req.body;
    let includeFlag = false;
    let publishPositions = orderInformation.publishPositions;

    let publishPositionsMap = new Map();
    let publishPositionsStringArray = [];
    orderInformation.publishPositions.forEach((position) => {
        publishPositionsMap.set(position.stationname, {amount: position.amount, currency: position.currency});
        publishPositionsStringArray.push(position.stationname);

    });
    let orderForm = new orderModel();
    if (publishPositionsStringArray.includes(orderInformation.receivePosition.stationname)) {
        includeFlag = true;
    }

//接单总价*20
    //发单 总价/发单人数 * 发单比例S1 接的广告
    // Total S1+S2+S3 = 600
    //
    // receiveposition S1= total * 20%
    //
    //     Publish position s1, s2, s3
    //
    // s1pub =(S1 :250) * 0.5
    // s2pub =(S2 :200) * 0.5
    // s3pub =(S3 :150) * 0.5

    {
        if (!orderInformation.adStatus) {
            orderForm.adStatus = 'Ongoing';
        } else {
            orderForm.adStatus = orderInformation.adStatus;
        }

        orderForm._id = req.body['_orderformid'];
        orderForm.adName = orderInformation.adName;
        orderForm.adType = orderInformation.adType;
        orderForm.adBeginDate = orderInformation.adBeginDate;
        orderForm.adEndDate = orderInformation.adEndDate;
        orderForm.publishType = orderInformation.publishType;
        orderForm.orderTotalAmont = orderInformation.orderTotalAmont;
        orderForm.customerName = orderInformation.customerName;
        orderForm.paymentMethod = orderInformation.paymentAmount;
        orderForm.receivePosition = orderInformation.receivePosition.stationname;
        orderForm.publishPositions = orderInformation.publishPositions;
        orderForm.customerWechat = orderInformation.customerWechat;
        orderForm.customerPhone = orderInformation.customerPhone;
        orderForm.remark = orderInformation.remark;
        orderForm.adContinue = orderInformation.adContinue;
        orderForm.checkOrderRecords = [];
    }
    {
        if (!(null !== publishPositions && Array.isArray(publishPositions))) {
            return res.status(503).send({success: false, message: 'publishPositions has promblems'});
        } else {
            angentModel.findByPositionName(publishPositionsStringArray, (error, result) => {
                if (error) {
                    logger.info(req.body);
                    logger.error('Error location : Class: orderformController, function: addOrderForm. ' + error);
                    logger.error('Response code:503, message: Error happen when adding to DB');
                    return res.status(503).send({success: false, message: 'Error happen when adding to DB'});
                }
                result.forEach((element) => {
                    let shouldPay, checkOrder;
                    if (includeFlag || element.stationname !== orderInformation.receivePosition.stationname) {
                        let everyPublishStation = publishPositionsMap.get(element.stationname);

                        shouldPay = Math.round(everyPublishStation.amount * element.publishrate * 100) / 100;
                        checkOrder = {
                            job: 'publish',
                            adName: orderInformation.adName,
                            adBeginDate: orderInformation.adBeginDate,
                            adEndDate: orderInformation.adEndDate,
                            receiveStation: orderInformation.receivePosition.stationname,
                            shouldPayStation: element.stationname,
                            customerWechat: orderInformation.customerWechat,
                            orderAmont: shouldPay,
                            currency: everyPublishStation.currency,
                            remark: orderInformation.remark
                        };

                        orderForm.checkOrderRecords.push(checkOrder);
                    }
                    if (element.stationname === orderInformation.receivePosition.stationname) {
                        let shouldPay = Math.round(orderInformation.orderTotalAmont//comes from user input
                            * element.receiverate * 100) / 100;

                        let checkOrder = {
                            job: 'receive',
                            adName: orderInformation.adName,
                            adBeginDate: orderInformation.adBeginDate,
                            adEndDate: orderInformation.adEndDate,
                            currency: orderInformation.receivePosition.currency,
                            receiveStation: element.stationname,
                            shouldPayStation: element.stationname,
                            customerWechat: orderInformation.customerWechat,
                            orderAmont: shouldPay,
                            remark: orderInformation.remark
                        };
                        orderForm.checkOrderRecords.push(checkOrder);
                    }
                });

                orderForm.save((err) => {
                    if (err) {
                        logger.info(req.body);
                        logger.error('Error location : Class: orderformController, function: addOrderForm. ' + err);
                        logger.error('Response code:503, message: Error Happened , please check input data');
                        res.status(503).send({
                            success: false,
                            message: 'Error Happened , please check input data!'
                        });
                    } else {
                        res.status(200).send({success: true, message: 'Successed Saved'});
                    }
                });
            });
        }
    }
};

exports.payAmount = (req, res) => {
    let paymentElement = {};
    paymentElement._id = req.body['checkOrderId'];
    paymentElement.paymentDate = req.body['payDay'];
    paymentElement.paymentAmount = req.body['paymentAmount'];
    orderModel.update({'checkOrderRecords._id': paymentElement._id }, {
            $push: {'checkOrderRecords.$.paymentHistories': {
                    paymentDate: paymentElement.paymentDate,
                    paymentAmount: paymentElement.paymentAmount
                }
            }
        }, (err) => {
            if (err) {
                logger.debug(req.body);
                logger.error('Error location : Class: orderformController, function: payAmount. ' + err);
                logger.error('Response code:503, message: Error Happened , please check input data');
                res.status(503).send({
                    success: false,
                    message: 'Error Happened , please check input data!'
                });
            } else {
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
                logger.info(req.body);
                logger.error('Error location : Class: orderformController, function: updatePayment. ' + err);
                logger.error('Response code:503, message: Error Happened , please check input data');
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
                }, (err) => {
                    if (err) {
                        logger.info(req.body);
                        logger.error('Error location : Class: orderformController, function: updatePayment. ' + err);
                        logger.error('Response code:503, message: Error Happened , please check input data');
                        return res.status(503).send({
                            success: false,
                            message: 'Error Happened , please check input data!'
                        });
                    } else {
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
            logger.info(req.body);
            logger.error('Error location : Class: orderformController, function: deletePayment. ' + err);
            logger.error('Response code:503, message: Error Happened , please check input data!');
            return res.status(503).send({
                success: false,
                message: 'Error Happened , please check input data!'
            });
        } else {
            return res.status(200).send({success: true, message: 'Successed Deleted'});
        }
    });
};

exports.addOrderForm = addOrderForm;
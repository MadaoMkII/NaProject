const checkOrderModel = require('../modules/checkOrder');
const angentModel = require('../modules/agent');
const orderModel = require('../modules/orderForm');

exports.getOrderForm = (req, res) => {
    orderModel.find({}, {_id: 0, __v: 0, updated_at: 0, created_at: 0}, (err, data) => {
            if (err) {
                return res.status(406).send({success: false, message: 'Not Successed Saved'});
            }
            return res.status(200).send({success: true, orderForm: data});
        }
    );
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
            }
            return res.status(200).send({success: true, orderForm: data});
        }
    );
};
exports.addOrderForm = function (req, res) {

    let orderInformation = req.body;
    let flag = false, orderErrors = [];
    let publishPositions = orderInformation.publishPositions;

    if (publishPositions.includes(orderInformation.receivePosition)) {
        flag = true;
    } else {
        publishPositions.push(orderInformation.receivePosition);
    }
    let tempNumber = publishPositions.length;

    new orderModel(orderInformation).save((err) => {
        if (err) {
            console.log(orderErrors);
            orderErrors.push(err);
        }
    }).then(() => {
        if (null !== publishPositions && Array.isArray(publishPositions)) {
            angentModel.findByPositionName(publishPositions, (error, result) => {
                if (error) return res.status(503).send({success: false, message: 'Error happen when adding to DB'});
                result.forEach((element) => {
                    let shouldPay, checkOrder;
                    if (flag || element.stationname !== orderInformation.receivePosition) {
                        shouldPay = Math.round(orderInformation.orderTotalAmont
                            / tempNumber * element.publishrate * 100) / 100;
                        checkOrder = {
                            adStatus: 'Ongoing',
                            adName: orderInformation.adName,
                            adBeginDate: orderInformation.adBeginDate,
                            adEndDate: orderInformation.adEndDate,
                            receivePosition: orderInformation.receivePosition,
                            publishPosition: element.stationname,
                            customerWechat: orderInformation.customerWechat,
                            orderAmont: shouldPay,
                            remark: orderInformation.remark
                        };

                        new checkOrderModel(checkOrder).save((err) => {
                            if (err) {
                                console.log(err);
                                orderErrors.push(err);
                            }
                            if (element.stationname === orderInformation.receivePosition) {
                                let shouldPay = Math.round(orderInformation.orderTotalAmont
                                    * element.receiverate * 100) / 100;
                                let checkOrder = {
                                    adStatus: 'Ongoing',
                                    adName: orderInformation.adName,
                                    adBeginDate: orderInformation.adBeginDate,
                                    adEndDate: orderInformation.adEndDate,
                                    receivePosition: orderInformation.receivePosition,
                                    publishPosition: element.stationname,
                                    customerWechat: orderInformation.customerWechat,
                                    orderAmont: shouldPay,
                                    remark: orderInformation.remark
                                };
                                new checkOrderModel(checkOrder).save((err) => {

                                    if (err) {
                                        orderErrors.push(err);
                                    }
                                    if (orderErrors.length !== 0) {
                                        return res.status(503).send({
                                            success: false,
                                            message: 'Error Happened , please check input data!'
                                        });
                                    } else {
                                        return res.status(200).send({success: true, message: 'Successed Saved'});
                                    }
                                })

                            }
                        })
                    }
                })
            });
        }
    })
};
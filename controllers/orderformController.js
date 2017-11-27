const angentModel = require('../modules/agent');
const checkOrderModel = require('../modules/orderForm').checkFormModel;
const orderModel = require('../modules/orderForm').orderFormModel;

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
        if (null !== publishPositions && Array.isArray(publishPositions)) {

            angentModel.findByPositionName(publishPositions, (error, result) => {
                if (error) return res.status(503).send({success: false, message: 'Error happen when adding to DB'});
                let checkid = 0;
                result.forEach((element) => {
                    let shouldPay, checkOrder;
                    if (flag || element.stationname !== orderInformation.receivePosition) {
                        shouldPay = Math.round(orderInformation.orderTotalAmont
                            / tempNumber * element.publishrate * 100) / 100;

                        checkOrder = {
                            checkid: checkid++,
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
                            checkid: checkid++,
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
                console.log(orderForm)


                orderForm.save((err, data) => {
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
                });

            })
        }
    }
};


const angentModel = require('../modules/agent');
const orderModel = require('../modules/orderForm').orderFormModel;
const checkModel = require('../modules/orderForm').checkFormModel;
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
                if (error) return res.status(503).send({success: false, message: 'Error happen when adding to DB'});
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

let payAmount = (req, res) => {

    let paymentElement = {paymentDate: '2017-11-27 14:35:56.009', paymentAmount: 200};

    // paymentElement.paymentDate = req.body['payDay'];
    // paymentElement.paymentAmount = req.body['paymentAmount'];

    console.log(paymentElement);

//拿到之前的直接push
    orderModel.update({
            'checkOrderRecords._id': '5a1c934cb769882638bc0d4d'
        }, {
            $set: {
                'checkOrderRecords.$.paymentHistory': [{paymentDate: new Date(), paymentAmount: 1234}]
            }
        }, (err, data) => {

            console.log(err);
            console.log(data);
        }
    );

    //
    // orderModel.findOneAndUpdate({
    //         'checkOrderRecords._id': '5a1c934cb769882638bc0d4c'
    //     }, {
    //         $set: {
    //             'checkOrderRecords.0.adStatus': "1150"
    //         }
    //     }, (err, data) => {
    //
    //         console.log(err);
    //         console.log(data);
    //     }
    // );
    //orderModel.findOne({'checkOrderRecords': {$elemMatch: {_id: '5a1c934cb769882638bc0d4d'}}}, (err, data) => {


    // orderModel.findOneAndUpdate({_id: req.body['checkOrderId']}, {
    //     $push: {'paymentHistory': {'paymentDate': paymentElement.paymentDate,
    //         'paymentAmount': paymentElement.paymentAmount}}
    // }, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         return res.status(406).send({success: false, message: 'Not Successed Saved'});
    //     } else {
    //         console.log(data);
    //         return res.status(200).send({success: true, message: 'Successed Payment'});
    //     }
    // });

};
payAmount(null, null);
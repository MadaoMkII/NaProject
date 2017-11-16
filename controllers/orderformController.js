const checkOrderModel = require('../modules/checkOrder');
const angentModel = require('../modules/agent');
exports.addOrderForm = function (req, res, next) {

    let orderInformation = req.body;
    let flag = false;
    let publishPositions = orderInformation.publishPositions;

    if (publishPositions.includes(orderInformation.receivePosition)) {
        flag = true;
    } else {
        publishPositions.push(orderInformation.receivePosition);
    }
    let tempNumber = publishPositions.length;

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
                        customerWechat: orderInformation.customerWechat,
                        orderAmont: shouldPay,
                        remark: orderInformation.remark
                    };

                  let x=  new checkOrderModel(checkOrder).save().catch((err) => {
                        console.log(111111);
                        res.status(503).json({success: false, message: 'Error happen when adding to DB'});
                        return 'a';
                    });
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

                    new checkOrderModel(checkOrder).save((err, data) => {

                        if (err) {
                            return res.status(209).send({message: 'hhhh'})
                        } else {
                            return res.status(201).send({message: '@!!!!!!!'})
                            // res.status(200); .json({success: true, message: 'Order has been added to DB'});
                        }

                    });

                }

            })
        });

    }


};
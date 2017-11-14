const checkOrderModel = require('../modules/checkOrder');
const orderModel = require('../modules/orderForm');
const angentModel = require('../modules/agent');
var dateFormat = require('dateformat');
let addOrderForm = function (req, res) {
    // let positions = req.body.publishPosition;
    //let real = req.body.publishPositions;


    let orderInformation = ({
        adName: '哇哈哈', adType: 'guangao',
        adBeginDate: "23", adEndDate: new Date(),
        spreadType: 'wechat', spreadAmount: 1000,
        draweeName: 'da lao', paymentMethod: 'payapl',
        receivePosition: 'S1', publishPositions: ['S2', 'S1', 'S3'],
        dealerWechat: '战1', dealerPhone: 4087997598,
        remark: 'sdf'
    });

    let flag = false;
    let publishPositions = orderInformation.publishPositions;
    if (publishPositions.contains(orderInformation.receivePosition)) {
        flag = true;
    }
    publishPositions.push(orderInformation.receivePosition);
    if (null != publishPositions && Array.isArray(publishPositions)) {

        angentModel.findByPositionName(publishPositions, (err, result) => {
            if (err) console.log(err);
            result.forEach((element) => {

                if (flag || element.stationname !== orderInformation.receivePosition) {
                    let shouldPay = Math.round(orderInformation.spreadAmount
                        / publishPositions.length * element.publishrate * 100) / 100;
                    let checkOrder = {
                        adStatus: 'Ongoing',
                        adName: orderInformation.adName,
                        adBeginDate: orderInformation.adBeginDate,
                        adEndDate: orderInformation.adEndDate,
                        receivePosition: orderInformation.receivePosition,
                        publishPosition: element.stationname,
                        dealerWechat: orderInformation.dealerWechat,
                        orderTotalPaidAmont: shouldPay,
                        remark: orderInformation.remark
                    };

                    new checkOrderModel(checkOrder).save((err, data) => {
                        console.log(data)
                        if (err) console.log(err);

                    });
                }
            })
        });

    }
    // publishPositions.forEach((publishPositionName) => {
    //     console.log(publishPositionName);
    //
    //
    // })


    // let orderentity = new orderModel(ceshiOrder[0]);
    // orderentity.save((err,data)=>{
    //
    //
    // })


// positions.forEach((position) => {
//
//
//     let checkOrderEntity = new checkOrderModel(position);
//     checkOrderEntity.save((err, data) => {
//
//         if (err) {
//             console.log('chu shi le!');
//         } else {
//             console.log(data);
//         }
//     })
//
// })


}
addOrderForm();
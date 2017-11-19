const checkOrderModel = require('../modules/checkOrder');
const orderModel = require('../modules/orderForm');

exports.getCheckOrderForm = (req, res) => {
    checkOrderModel.find({}, {_id: 0, __v: 0, updated_at: 0, created_at: 0}, (err, data) => {
            if (err) {
                return res.status(406).send({success: false, message: 'Not Successed Saved'});
            }
            return res.status(200).send({success: true, orderForm: data});
        }
    );
};
// exports.deletePayment = (req, res) => {
//     checkOrderModel.update({_id: req.body['payid']}, {$pull: {paymentHistory: {number: '+1786543589455'}}})
// };
exports.payAmount = (req, res) => {

    checkOrderModel.update({checkOrderId: req.body['checkOrderId']}, {
        $push: {paymentHistory: {paymentDate: new Date(), paymentAmount: req.body['paymentAmount']}}
    }, (err, data) => {

        if (err) {
            console.log(err);
            return res.status(406).send({success: false, message: 'Not Successed Saved'});
        }
        return res.status(200).send({success: true, orderForm: data});
    });

};

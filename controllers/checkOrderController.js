const checkOrderModel = require('../modules/orderForm').checkFormModel;
const orderModel = require('../modules/orderForm').orderFormModel;

exports.getCheckOrderForm = (req, res) => {
    checkOrderModel.find({}, {__v: 0, updated_at: 0, created_at: 0}, (err, data) => {
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

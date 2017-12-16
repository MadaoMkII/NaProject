const config = require('../config/develop');
const agentModel = require('../modules/agent').agentModel;
const logger = require('../logging/logger');

exports.addAdmin = (req, res) => {

    let result = require('crypto').createHash('md5').update(req.body.password + config.saltword).digest('hex');
    let userInfo = {
        username: req.body.username,
        password: result,
        country: req.user.country,
        role: 'Admin',
        registerby: req.user.stationname,
        stationname: req.body.stationname,
        receiverate: req.body.receiverate,
        publishrate: req.body.publishrate
    };
    new agentModel(userInfo).save((err) => {
        if (err) {
            logger.info(req.body);
            logger.error('Error location : Class: userController, function: addAgent. ' + err);
            logger.error('Response code:503, message: Error Happened , please check input data');

            if (err.toString().includes('duplicate')) {
                return res.status(406).json({
                    success: false,
                    message: 'Duplication Username or StationName. The Statian name is :' + userInfo.stationname
                });
            } else {
                return res.status(409).json({success: false, message: 'Error happen when adding to DB'});
            }
        }
        return res.status(200).json(userInfo);
    });
};

exports.addAgent = (req, res) => {

    let result = require('crypto').createHash('md5').update(req.body.password + config.saltword).digest('hex');
    let userInfo = {
        username: req.body.username,
        password: result,
        country: req.user.country,
        role: 'Agent',
        registerby: req.user.stationname,
        stationname: req.body.stationname,
        receiverate: req.body.receiverate,
        publishrate: req.body.publishrate
    };
    new agentModel(userInfo).save((err) => {
        if (err) {
            logger.info(req.body);
            logger.error('Error location : Class: userController, function: addAgent. ' + err);
            logger.error('Response code:503, message: Error Happened , please check input data');

            if (err.toString().includes('duplicate')) {
                return res.status(406).json({
                    success: false,
                    message: 'Duplication Username or StationName. The Statian‘s name :' + userInfo.stationname
                });
            } else {
                return res.status(409).json({success: false, message: 'Error happen when adding to DB'});
            }
        }
        return res.status(200).json(userInfo);
    });
};

exports.getMyRegisterAgents = (req, res) => {

    agentModel.find({registerby: req.user.stationname}, {password: 0}, (err, agents) => {

        if (err) {
            return res.status(404).json({'succeed': false, 'massage': 'Can not find anything'});
        }
        return res.status(200).json(agents);
    })
};

exports.getArea = (req, res) => {

    agentModel.find({country: req.params.country}, {password: 0}, (err, agents) => {
        if (err) {
            return res.status(404).json({'succeed': false, 'massage': 'Can not find anything'});
        }
        return res.status(200).json(agents);
    })
};


exports.updatepassword = (req, res) => {
    let hashedPassword =
        require('crypto').createHash('md5').update(req.body['newpassword'] + config.saltword).digest('hex');

    agentModel.update({username: req.user.username}, {$set: {password: hashedPassword}}, (err) => {
        if (err) {
            return res.status(404).json({'succeed': false, 'massage': 'Can not find anything'});
        }
        req.logOut();
        return res.status(200).json({'succeed': true, 'massage': 'Please relogin'});
    })
};
//
// exports.getLimitAgents = function (req, res) {
//     let today = new Date();
//     today.setMonth(today.getMonth() - 1);
//
//     agentModel.find().where('createtimestamp').lt(today).sort('createtimestamp').exec((err, agents) => {
//         if (err) {
//
//             return res.status(404).json({'succeed': false, 'massage': 'Can not find anything'});
//         }
//
//
//         return res.status(200).json(agents);
//
//
//     });
//
// };

const config = require('../config/develop');
const agentmodel = require('../modules/agent');
const logger = require('../logging/logger');


exports.addagent = (req, res) => {

    let hashresult = require('crypto').createHash('md5').update(req.body.password + config.saltword).digest('hex');
    let userinfo = {
        username: req.body.username,
        password: hashresult,
        country: req.user.country,
        role: 'agent',
        registerby: req.user.stationname,
        stationname: req.body.stationname,
        receiverate: req.body.receiverate,
        publishrate: req.body.publishrate
    };
    new agentmodel(userinfo).save(userinfo, (err) => {
        if (err) {
            logger.info(req.body);
            logger.error('error location : class: usercontroller, function: addagent. ' + err);
            logger.error('response code:503, message: error happened , please check input data');

            if (err.toString().includes('duplicate')) {
                return res.status(406).json({
                    success: false,
                    message: 'duplication username or stationname. the statian‘s name :' + userinfo.stationname
                });
            } else {
                return res.status(409).json({success: false, message: 'error happen when adding to db'});
            }
        }
        return res.status(200).json(userinfo);
    });
};

exports.addadmin = function (req, res) {
    let result = require('crypto').createHash('md5').update(req.body.password + config.saltword).digest('hex');
    let agentinfo = {
        username: req.body.username,
        password: result,
        country: req.body.country,
        role: 'admin',
        registerby: req.user.stationname
    };
    return res.status(200).json(agentinfo);
};

exports.getallagents = (req, res) => {
    agentmodel.find({'registerby': req.user.stationname}, {username: 1, country: 1, stationname: 1},
        (err, agents) => {
            if (err) {
                console.log(err);
                return res.status(404).json({'succeed': false, 'massage': 'can not find anything'});
            }
            return res.status(200).json(agents);

        })
};

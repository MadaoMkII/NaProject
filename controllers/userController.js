const crypto = require('crypto');
const dateFormat = require('dateformat');
const config = require('../config/develop')
const agent = require('../models/angent');
let agentModel = agent.agentModel;

exports.addAgent = function (req, res) {
    let username = req.body.username;

    agent.isDuplicationName(username, (err, flag) => {

        if (err) console.log(err + "!!!!!");

        if (flag) return res.status(406).json({
            success: false,
            message: 'Duplication Username'
        });

        let md5 = crypto.createHash('md5');
        let salt = 'abl';
        let result = md5.update(username + salt).digest('hex');
        let userInfo = {
            'username': username,
            'password': result,
            'country': req.user.country,
            'role': 'Agent',
            'stationname': req.body.stationname,
            'receiverate': req.body.receiverate,
            'publishrate': req.body.publishrate,
            'createtimestamp': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
        };
        let agentEntity = new agentModel(userInfo);
        agentEntity.save(function (err, log) {
            if (err) {
                console.log("error :" + err);
            } else {       //doc是返回刚存的person对象
                console.log(log);
            }
        })
        return res.status(200).json(userInfo);


    })


};

exports.addAdmin = function (req, res, err) {
    let salt = 'abl';
    let result = md5.update(req.body.password + salt).digest('hex');

    let agentInfo = {
        'username': req.body.username,
        'password': result,
        'country': req.body.country,
        'role': 'Admin',
        'createtimestamp': new Date().toISOString()
    };

    return res.status(200).json(agentInfo);
};

exports.getAllAgents = function (req, res) {

    agentModel.find({}, 'username country role createtimestamp', (err, agents) => {

        if (err) {
            console.log(err);
            return res.status(404).json({'succeed': false, 'massage': 'Can not find anything'});
        }

        return res.status(200).json(agents);


    })


};
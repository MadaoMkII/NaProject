const config = require('../config/develop')
const agentModel = require('../modules/agent');

exports.addAgent = function (req, res) {

    let result = require('crypto').createHash('md5').update(req.body.password + config.saltword).digest('hex');
    let userInfo = {
        'username': req.body.username,
        'password': result,
        'country': req.user.country,
        'role': 'Agent',
        'stationname': req.body.stationname,
        'receiverate': req.body.receiverate,
        'publishrate': req.body.publishrate
    };
    let agentEntity = new agentModel(userInfo);
    agentEntity.save(userInfo, (err) => {
        if (err) {
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


}


// exports.addAdmin = function (req, res) {
//     //todo
//     // let salt = 'abl';
//     // let result = md5.update(req.body.password + salt).digest('hex');
//     // let agentInfo = {
//     //     'username': req.body.username,
//     //     'password': result,
//     //     'country': req.body.country,
//     //     'role': 'Admin',
//     //     'createtimestamp': dateFormat(new Date(), 'yyyy-mm-dd,HH:MM:ss ')
//     // };
//     // return res.status(200).json(agentInfo);
// }

// exports.getAllAgents = function (req, res) {
//
//     agentModel.find({}, 'username country role createtimestamp', (err, agents) => {
//
//         if (err) {
//             console.log(err);
//             return res.status(404).json({'succeed': false, 'massage': 'Can not find anything'});
//         }
//         return res.status(200).json(agents);
//
//     })
// };
//
// exports.getLimitAgents = function (req, res) {
//     let today = new Date();
//     today.setMonth(today.getMonth() - 1);
//
//     agentModel.find().where('createtimestamp').lt(today).sort('createtimestamp').exec((err, agents) => {
//         if (err) {
//             console.log(err);
//             return res.status(404).json({'succeed': false, 'massage': 'Can not find anything'});
//         }
//
//         console.log(data);
//         return res.status(200).json(agents);
//
//
//     });
//
// };

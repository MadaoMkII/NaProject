const agent = require('../modules/angent');
const config = require('../config/develop')


exports.addAgent = function (req, res) {
    let testdata = {};
    testdata.username = req.body.username;
    testdata.stationname = req.body.stationname;

    agent.isDuplicationName(testdata, (err, flag) => {

        if (err) console.log(err);

        if (flag) return res.status(406).json({
            success: false,
            message: 'Duplication Username or StationName with:' + flag.stationname
        });

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

        agent.addNewAgent(userInfo);
        return res.status(200).json(userInfo);


    })


};

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

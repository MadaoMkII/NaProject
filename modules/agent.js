let mongoose = require('mongoose');
let db = require('../db/db');

let agentSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    password: String,
    country: String,
    role: String,
    stationname: {
        type: String,
        index: true,
        unique: true
    },
    receiverate: Number,
    publishrate: Number
}, {'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}});
let agentModel = mongoose.model('Agent', agentSchema);

exports.addNewAgent = function (userinfo) {
    let agentEntity = new agentModel(userinfo);

    agentEntity.save(function (err, data) {

        if (err) {
            console.log(err);
            return err;

        }
    })


    exports.findByUserName = function (username, callback) {

        agentModel.find({'username': username}, 'name occupation', (err, agents) => {

            if (err) console.log(err + '!');
            return callback(err, agents);

        })
    }
    exports.findByPositionName = function (stationname, callback) {

        agentModel.find({stationname: {"$in": stationname}}, {
            _id: 0,
            receiverate: 1,
            publishrate: 1,
            stationname: 1
        }, (err, agents) => {

            if (err) console.log(err + '!');
            return callback(err, agents);

        })
    }
    exports.getAllAgent = function (callback) {
        agentModel.find({'role': {$eq: 'Agent'}}, 'username country role stationname receiverate publishrate createtimestamp',
            (err, agents) => {
                if (err) return console.log(err);
                if (agents) return callback(null, agents);
                return callback(err, {'Massage': 'Can not find anything'});
            })
    }

    exports.isDuplicationName = function (data, callback) {

        agentModel.findOne({$or: [{'username': data.username, 'stationname': data.stationname}]}, (err, agents) => {

            if (err) return null;
            if (agents) return callback(null, agents);
            return callback(err, false);

        })

    }
}
module.exports = agentModel;


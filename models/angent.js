let mongoose = require('mongoose');
let db = require('../db/db');
let agentSchema = new mongoose.Schema({
    username: String, password: String, country: String
    , role: String, stationname: String, receiverate: Number,
    publishrate: Number, createtimestamp: Date
});
let agentModel = mongoose.model('Agent', agentSchema);

exports.findByName = function (username, callback) {

    agentModel.find({'username': username}, 'name occupation', (err, agents) => {

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


exports.agentModel = agentModel;

const mongoose = require('mongoose');
const db = require('./db/db');

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
        required: true,
        type: String,
        index: true,
        unique: true
    },
    receiverate: {required: true, type: Number},
    publishrate: {required: true, type: Number}
}, {'timestamps': {'createdAt': 'created_at', 'updatedAt': 'updated_at'}});
agentSchema.virtual('members', {
    ref: 'Band', // The model to use
    localField: 'stationname', // Find people where `localField`
    foreignField: 'stationname', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true
});

var BandSchema = new mongoose.Schema({
    stationname: String
}, {toJSON: {virtuals: false}});

var Band = mongoose.model('Band', BandSchema);
let agentModel = mongoose.model('Agent', agentSchema);

agentModel.find({}).populate('members').exec(function (error, bands) {
    console.log(bands)
    // Works, foreign field `band` is selected
});
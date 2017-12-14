const passport = require('passport');
const config = require('../config/develop');
const angentModel = require('../modules/agent').agentModel;
const logger = require('../logging/logger');
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function (user, callback) {
    callback(null, user.username);
});
let foundUser = {};
passport.deserializeUser(function (username, callback) {
        angentModel.findOne({'username': username}, function (err, user) {
            callback(err, user);
        });
    }
);
passport.use(new LocalStrategy('local', (username, password, callback) => {
        let resultPassowrd = require('crypto').createHash('md5').update(password + config.saltword).digest('hex');
        angentModel.findOne({'username': username, 'password': resultPassowrd}, (err, data) => {
            foundUser = data;
            if (err) {
                logger.error('passport: passport.use ' + err);
                return callback(err, false);
            }
            if (!data) return callback(null, false);

            return callback(err, data);
        })

    }
));
module.exports = passport;
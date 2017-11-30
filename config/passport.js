const passport = require('passport');
const config = require('../config/develop');
const angentModel = require('../modules/agent');

const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function (user, callback) {
    callback(null, user.username);
});
let foundUser = {};
passport.deserializeUser(function (username, callback) {
        angentModel.findOne({'username': username}, function (err, user) {
            console.log(user)
            callback(err, user);
        });
    }
);
passport.use(new LocalStrategy('local',
    function (username, password, callback) {
        let resultPassowrd = require('crypto').createHash('md5').update(password + config.saltword).digest('hex');
        angentModel.findOne({'username': username, 'password': resultPassowrd}, (err, data) => {
            foundUser = data;
            if (err) {
                return callback(err, false);
            }
            if (!data) return callback(null, false);

            return callback(err, data);
        })

    }
));

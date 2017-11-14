let passport = require('passport');
let users = require('../db/users');
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function (user, callback) {
    callback(null, user.username);
});

passport.deserializeUser(function (username, callback) {
        users.findByUsername(username, function (err, user) {
            callback(err, user);
        });
    }
);
passport.use(new LocalStrategy('local',
    function (username, password, callback) {

        users.findByUsername(username, function (err, data) {
            if (err != null) {
                return callback(err, false);
            }
            if (data === null) return callback(null, false);
            if (data.password !== password) return callback({'error': 'wtf'}, false);
            return callback(err, data);
        });
    }
));

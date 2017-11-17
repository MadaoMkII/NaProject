var passport = require('passport');


exports.loginUser = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (req.user) req.logout();
        if (err) {

            return res.status(401).json({success: false, message: 'Login faild'});// will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
            return res.status(401).json({success: false, message: 'Authentication faild, need login first'});
        }
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).json({success: true, message: 'Authentication succeeded'});
        });
    })(req, res, next);
}
//tool function translates Privilege to amount
let getPrivilege = function (privilegeName) {
    let privilege = 0;
    switch (privilegeName) {
        case 'Admin':
            privilege = 30;
            break;
        case 'Super_Admin':
            privilege = 50;
            break;
        case 'Agent':
            privilege = 10;
            break;
        default:
            privilege = -1;

    }
    return privilege;
}
//check if user has been login though passport
//check if the requst has enough privilege for a certain API
exports.isAuthenticated = function (privilegeName) {

    return function (req, res, next) {

        if (req.user) {
            if (req.user.role !== null && getPrivilege(req.user.role) < getPrivilege(privilegeName)) {
                return res.status(403).json({success: false, message: 'Insufficient privilege'})
            }
            return next();

        } else {
            return res.status(401).json(
                {success: false, message: 'Authentication faild, need login first'}
            );
        }


    }
}

var express = require('express');
var passport = require('passport');
const userController = require('./controllers/userController');
const orderformController = require('./controllers/orderformController');
const isAuthenticated = require('./controllers/authController').isAuthenticated;
const loginUser = require('./controllers/authController').loginUser;

var bodyParser = require('body-parser');
var session = require('express-session');

var json_body_parser = bodyParser.json();
var urlencoded_body_parser = bodyParser.urlencoded({extended: true});
const passportService = require('./config/passport');
var app = express();
app.use(json_body_parser);
app.use(urlencoded_body_parser);
app.use(session({
    secret: 'abc', resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure the Basic strategy for use by Passport.
//
// The Basic strategy requires a `verify` function which receives the
// credentials (`username` and `password`) contained in the request.  The
// function must verify that the password is correct and then invoke `cb` with
// a user object, which will be set at `req.user` in route handlers after
// authentication.
// Create a new Express application.
// Configure Express application.

app.get('/checkhealth', isAuthenticated('Agent'), function (req, res) {
    res.status(200).json({
        success: true,
        message: 'Login successful! ' + 'Your role is : ' + req.user.role +
        '  Your username is : ' + req.user.username
    });
});
app.post('/addOrder', isAuthenticated('Admin'), orderformController.addOrderForm);//DONE
app.post('/addAgent', isAuthenticated('Admin'), userController.addAgent);//done

app.post('/getOrderFormByDates', isAuthenticated('Admin'), orderformController.getOrderFormByDates);//done
//app.post('/paycheckOrder', isAuthenticated('Admin'), orderformController.payAmount);//doing
app.post('/getOrderForm', isAuthenticated('Admin'), orderformController.getOrderForm);
// app.post('/addAdmin', isAuthenticated('Super_Admin'), userController.);

app.get('/abc', isAuthenticated('Super_Admin'), function (req, res) {
    res.json({username: 'unknow'});
});

app.post('/login', loginUser);


app.listen(3000);
console.log("Begin");
const express = require('express');
const passport = require('passport');
const userController = require('./controllers/userController');
const orderformController = require('./controllers/orderformController');
const isAuthenticated = require('./controllers/authController').isAuthenticated;
const loginUser = require('./controllers/authController').loginUser;


const bodyParser = require('body-parser');
const session = require('express-session');

const json_body_parser = bodyParser.json();
const urlencoded_body_parser = bodyParser.urlencoded({extended: true});
const passportService = require('./config/passport');


// todo NODE_ENV will use
let app = express();


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

app.post('/addagent', isAuthenticated('Admin'), userController.addAgent);//done

app.post('/addorderform', isAuthenticated('Agent'), orderformController.addOrderForm);//DONE
app.get('/getorderform', isAuthenticated('Agent'), orderformController.getOrderForm);
app.get('/getmypublishorderform', isAuthenticated('Agent'), orderformController.getMyPublishOrderform);
app.get('/getmyreceiveorderform', isAuthenticated('Agent'), orderformController.getMyreceiveOrderform);
app.get('/getorderformbyid', isAuthenticated('Admin'), orderformController.getOrderFormByCheckId);
app.post('/getorderformbydates', isAuthenticated('Admin'), orderformController.getOrderFormByDates);//done
app.post('/updateorderform', isAuthenticated('Admin'), orderformController.updateOrderForm);//done
app.post('/paycheckOrder', isAuthenticated('Admin'), orderformController.payAmount);//done
app.post('/updatepayorder', isAuthenticated('Admin'), orderformController.updatePayment);//done
app.post('/deletepayorder', isAuthenticated('Admin'), orderformController.deletePayment);//done

// app.post('/addAdmin', isAuthenticated('Super_Admin'), userController.);
app.post('/login', loginUser);


app.listen(3000);
console.log("Begin Server");
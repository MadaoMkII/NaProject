const express = require('express');
const passport = require('./config/passport').passport;
const userController = require('./controllers/userController');
const orderformController = require('./controllers/orderformController');
const isAuthenticated = require('./controllers/authController').isAuthenticated;
const loginUser = require('./controllers/authController').loginUser;
const logoutUser = require('./controllers/authController').logoutUser;

const bodyParser = require('body-parser');
const session = require('express-session');

const json_body_parser = bodyParser.json();
const urlencoded_body_parser = bodyParser.urlencoded({extended: true});


let adminRouter = express.Router();
let agentRouter = express.Router();
let loginRouter = express.Router();
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

agentRouter.get('/checkhealth', isAuthenticated('Agent'), function (req, res) {
    res.status(200).json({
        success: true,
        message: 'Login successful! ' + 'Your role is : ' + req.user.role +
        ',  Your username is : ' + req.user.username + ',  Your station is : ' + req.user.stationname
    });
});

adminRouter.post('/user/addagent', isAuthenticated('Agent'), userController.addAgent);//done
// agentRouter.post('/user/resetpassword', isAuthenticated('Super_Admin'), userController.add);//done


agentRouter.post('/addorderform', isAuthenticated('Agent'), orderformController.addOrderForm);//DONE
agentRouter.get('/getmyorderform/:option', isAuthenticated('Agent'), orderformController.getMyOrderform);


// adminRouter.get('/orderform/getorderform', isAuthenticated('Agent'), orderformController.getOrderForm);
// adminRouter.post('/orderform/getorderformbydates', isAuthenticated('Admin'), orderformController.getOrderFormByDates);//done
adminRouter.post('/orderform/updateorderform', isAuthenticated('Admin'), orderformController.updateOrderForm);//done
adminRouter.post('/orderform/paycheckOrder', isAuthenticated('Admin'), orderformController.payAmount);//done
adminRouter.post('/orderform/updatepayorder', isAuthenticated('Admin'), orderformController.updatePayment);//done
adminRouter.post('/orderform/deletepayorder', isAuthenticated('Admin'), orderformController.deletePayment);//done

loginRouter.post('/login', loginUser);
loginRouter.post('/logout', logoutUser);

app.use('/user', loginRouter);
app.use('/', agentRouter);

app.listen(3000);
console.log("Begin Server");
const express = require('express');
const passport = require('./config/passport');
const userController = require('./controllers/userController');
const orderformController = require('./controllers/orderformController');
const isAuthenticated = require('./controllers/authController').isAuthenticated;
const loginUser = require('./controllers/authController');

const bodyParser = require('body-parser');
const session = require('express-session');

const json_body_parser = bodyParser.json();
const urlencoded_body_parser = bodyParser.urlencoded({extended: true});

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
    if (req.user) {
        return res.status(200).json({
            success: true,
            message: 'Login successful! ' + 'Your role is : ' + req.user.role +
            '  Your username is : ' + req.user.username
        });
    } else {
        return res.status(200).json({
            success: true,
            message: 'Server is running, but you need to login'
        });
    }
});

app.post('/user/addagent', isAuthenticated('Admin'), userController.addAgent);//done
app.post('/user/addadmin', isAuthenticated('Super_Admin'), userController.addAdmin);//done
app.post('/user/updatepassword', isAuthenticated('Agent'), userController.updatepassword);//done

app.get('/user/mystations', isAuthenticated('Admin'), userController.getMyRegisterAgents);//done
app.get('/user/:country', isAuthenticated('Super_Admin'), userController.getArea);//done

app.post('/orderform/addorderform', isAuthenticated('Agent'), orderformController.addOrderForm);//DONE
app.get('/orderform/getorderform/:option', isAuthenticated('Agent'), orderformController.getOrderform);
app.post('/orderform/updateorderform', isAuthenticated('Admin'), orderformController.updateOrderForm);//done
app.delete('/orderform/deleteorderform', isAuthenticated('Admin'), orderformController.deleteOrderForm);//done


app.post('/orderform/checkOrder/paycheckorder', isAuthenticated('Admin'), orderformController.payAmount);//done
app.post('/orderform/checkOrder/updatecheckorder', isAuthenticated('Admin'), orderformController.updatePayment);//done
app.delete('/orderform/checkOrder/deletecheckorder', isAuthenticated('Admin'), orderformController.deletePayment);//done

app.post('/login', loginUser.loginUser);
app.post('/logout', loginUser.logoutUser);
app.listen(3000);
console.log("Begin Server");
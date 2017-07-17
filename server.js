'use strict';

//load .env 
require('dotenv').config();

//depencencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

const cors = require('cors')

const routes = require('./app/routes/index');
const userRoutes = require('./app/routes/users')
const api = require('./app/routes/api')

//init passport setup
require('./app/config/passport')(passport);

//init express function
const app = express();

// view engine setup 
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/app/views/layouts'),
    partialsDir: path.join(__dirname, '/app/views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/app/views'));

//hide warning message about promise
// mongoose.Promise = global.Promise; //removed for cloudnode

//connect to db
mongoose.connect(process.env.mongodb, (err) => {
    if (err) console.log('could not connect to db!', err);
})

app.use(cors()); //remove this later?

//setting my static paths
app.use('/client_assets', express.static(path.join(__dirname, 'client_assets')));
app.use('/public', express.static(path.join(__dirname, '/public')));

//Hooking up middleware
app.use(helmet());
app.use(logger('dev'));

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } //auto log out after 60 min inactivity with server
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


//adding my routes
app.use('/', routes);
app.use('/users', userRoutes);
api(app);

//ERROR
// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler, will print stacktrace
if (app.get('env') === 'development') { //returns 'development' if NODE_ENV is not defined
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//listen
const port = process.env["app_port"] || 3000;
app.listen(port, () => {
    console.log('listening to port ' + port);
})
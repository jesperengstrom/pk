'use strict';

//depencencies etc
const express = require('express');
const routes = require('./app/routes/index');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//AUTH DEPENCENCIES
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// view engine setup 
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir: process.cwd() + '/app/views/partials'
}));
app.set('view engine', 'handlebars');
app.set('views', process.cwd() + '/app/views');


//setup database
var configDB = require('./app/config/database');
mongoose.connect(configDB.url);

//Adding app auth middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'shhsecret',
    resave: true, //??
    saveUninitialized: true //??
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//setting a static path for my dirs
app.use('/', express.static(process.cwd() + '/app/views'))
app.use('/public', express.static(process.cwd() + '/public'))
app.use('/client_assets', express.static(process.cwd() + '/client_assets'))

//routes ready
routes(app);

//listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening to port ' + port);
})
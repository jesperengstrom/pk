'use strict';

//load .env 
require('dotenv').config();

//depencencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
// const LocalStrategy = require('passport-local').Strategy;
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

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

//connect to db
mongoose.connect(process.env.DB_HOST)

//setting my static paths
app.use('/client_assets', express.static(path.join(__dirname, 'client_assets')));
app.use('/public', express.static(path.join(__dirname, '/public')));

//Hooking up middleware
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//adding my routes
const routes = require('./app/routes/index');
app.use('/', routes);

//setting up api
const api = require('./app/routes/api')
api(app);

//init passport setup
require('./app/config/passport')(passport);

//listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening to port ' + port);
})
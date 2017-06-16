'use strict';

//depencencies etc
const express = require('express');
const routes = require('./app/routes/index.js');
const mongoose = require('mongoose');

const mongoUrl = 'mongodb://127.0.0.1:27017/pk';
const app = express();

// const mongo = require('mongodb').MongoClient;
//Old mongoDb connection
// mongo.connect(mongoUrl, (err, db) => {
//     if (err) {
//         console.log('could not connect to db');
//         throw err;
//     } else console.log('connected to db');

mongoose.Promise = require('bluebird');
mongoose.connect(mongoUrl);

//setting a static path for my dirs
app.use('/', express.static(process.cwd()))
app.use('/controllers', express.static(process.cwd() + '/app/controllers'))
app.use('/user', express.static(process.cwd() + '/views/user'))

//routes ready
// routes(app, db);
routes(app);

//listen
const port = 3000;
app.listen(port, () => {
    console.log('listening to port ' + port);
})

// })
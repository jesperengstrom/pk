//depencencies etc
const express = require('express');
const app = express();
const port = 3000;
const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://127.0.0.1:27017/pk';
const routes = require('./app/routes');


//connecting to db
mongo.connect(mongoUrl, (err, db) => {
    if (err) {
        console.log('could not connect to db');
        throw err;
    } else console.log('connected to db');

    //setting a static path for my dirs
    app.use('/', express.static(process.cwd()))
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'))
    app.use('/user', express.static(process.cwd() + '/views/user'))

    //routes ready
    routes(app, db);

    //listen
    app.listen(port, () => {
        console.log('listening to port' + port);
    })
})
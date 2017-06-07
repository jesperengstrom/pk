const express = require('express');
const app = express();

const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://127.0.0.1:27017/pk';
const routes = require('./app/routes');

mongo.connect(mongoUrl, (err, db) => {
    if (err) {
        console.log('could not connect to db');
        throw err;
    } else console.log('connected');
    routes(app, db);
})
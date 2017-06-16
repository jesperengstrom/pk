//mongoose schemas
'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pkSchema = new Schema({
    name: String,
    dateTime: {
        date: String,
        time: String
    },
    coords: {
        lat: Number,
        lng: Number
    }
}, { collection: 'pk' });

module.exports = mongoose.model('pk', pkSchema);
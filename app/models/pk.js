//mongoose schemas
'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pkSchema = new Schema({
    name: { type: String, required: true },
    obsDate: { type: Date, required: true },
    coords: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    created: { type: Date },
    updated: { type: Date }
}, { collection: 'pk' });

module.exports = mongoose.model('pk', pkSchema);
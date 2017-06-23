//mongoose schema - for timestamping the collection
'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pkTimestampSchema = new Schema({
    name: { type: String, default: 'timestamp' },
    timestamp: { type: Date, default: Date.now, required: true }
}, { collection: 'pk_timestamp' });

module.exports = mongoose.model('pk_timestamp', pkTimestampSchema);
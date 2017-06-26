//mongoose schemas
'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pkSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    obsDate: {
        type: Date,
        required: true
    },
    obsLocation: {
        adress: {
            type: String,
            required: true
        },
        coords: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        }
    },
    opLocation: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    },
    witness: {
        type: String,
        required: true
    },
    observation: {
        summary: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    policeContacts: {
        calledIn: {
            type: Date
        },
        interrogations: [{
            interrDate: {
                type: Date
            },
            protocol: {
                type: String
            }
        }],
        other: {
            type: String
        }
    },
    categories: [{
        type: String
    }],
    sources: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
        }
    }],
    other: {
        type: String
    },
    created: {
        date: {
            type: Date
        },
        user: {
            type: String
        }
    },
    updated: {
        date: {
            type: Date
        },
        user: {
            type: String
        }
    }
}, { collection: 'pk' });

module.exports = mongoose.model('pk', pkSchema);
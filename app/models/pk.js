//mongoose schemas
'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const categories = ['Walkie Talkie', 'Förföljare', 'Grand', 'Gamla Stan'];

var pkSchema = new Schema({
    title: {
        type: String,
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
    obsDate: {
        type: Date,
        required: true
    },
    witness: {
        name: {
            type: String,
            required: true
        },
        coords: {
            lat: {
                type: Number
            },
            lng: {
                type: Number
            }
        }
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
            // type: Date //have 2 have option to insert null
        },
        numInterrogations: {
            type: Number
        },
        interrogations: [{
            interrDate: {
                type: Date
            },
            protocolUrl: {
                type: String
            }
        }],
        followUp: {
            type: String
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
    categories: [{
        type: String,
        // required: true,
        enum: categories
    }],
    sources: [{
        name: {
            type: String,
            // required: true
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
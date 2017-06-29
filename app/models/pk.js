//mongoose schemas
'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const categories = ['Mordkvällen', 'Walkie Talkie', 'Möjlig övervakare', 'Förföljare', 'Grand', 'Gamla Stan', 'bil'];

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
            // type: Date //no, have 2 have option to insert null
        },
        numInterrogations: {
            type: Number
        },
        protocols: [{
            date: {
                type: Date
            },
            url: {
                type: String
            }
        }],
        followUp: {
            type: String
        }
    },
    opLocation: {
        coords: {
            lat: {
                type: Number
            },
            lng: {
                type: Number
            }
        }
    },
    other: {
        type: String
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
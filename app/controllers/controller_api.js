'use strict';
//importing mongoose.model = constructor
const Pk = require('../models/pk');
const PkTimestamp = require('../models/pk_timestamp');

function ApiController() {
    const ObjectId = require('mongodb').ObjectID;

    this.addDoc = (req) => {
        console.log(req.body)
        let reqBody = req.body;

        let addObj = {
            'title': reqBody.title,
            'obsLocation': {
                'adress': reqBody.adress,
                'coords': {
                    'lat': reqBody['obs-lat'],
                    'lng': reqBody['obs-lng']
                }
            },
            'obsDate': new Date(reqBody['obs-date'] + " " + reqBody['obs-time']),
            'witness': {
                'name': reqBody['witness-name'],
                'coords': {
                    'lat': reqBody['witness-lat'],
                    'lng': reqBody['witness-lng']
                }
            },
            'observation': {
                'summary': reqBody['obs-summary'],
                'description': reqBody.description
            },
            'policeContacts': {
                'calledIn': reqBody['called-in'] === "" ? null : new Date(reqBody['called-in']),
                'numInterrogations': reqBody['num-interrogations'],
                'interrogations': constructArray(),
                'followUp': reqBody['follow-up']
            },
            'created': {
                'date': Date.now(),
                'user': req.user.username
            },
            'updated': {
                'date': null,
                'user': null
            }
        };

        function constructArray() {
            let array = [];
            for (let i in reqBody['interr-date']) {
                array.push({
                    'interrDate': new Date(reqBody['interr-date'][i]),
                    'protocolUrl': reqBody['protocol-url'][i]
                })
            }
            return array;
        }

        Pk.create(addObj), (err, res) => {
            if (err) throw err;
        };
    }

    this.updateDoc = (req) => {
        let reqBody = req.body,
            id = req.query.id,
            title = reqBody.title,
            obsDate = new Date(reqBody['obs-date'] + " " + reqBody['obs-time']),
            adress = reqBody.adress,
            lat = reqBody.lat,
            lng = reqBody.lng,
            user = req.user.username,
            updated = Date.now();
        Pk.update({ _id: ObjectId(id) }, {
            'title': title,
            'obsDate': obsDate,
            'obsLocation': {
                'adress': adress,
                'coords': {
                    'lat': lat,
                    'lng': lng
                }
            },
            'updated': {
                'date': updated,
                'user': user
            }
        }, (err, result) => {
            if (err) throw err;
            console.log('Updated PK: ', result);
        })
    }

    //The list of docs used to render timeline & map
    this.getDocList = (req, res) => {
        Pk.find({})
            .select('_id title obsDate obsLocation') //we only need these fields
            .exec((err, docs) => {
                if (err) throw err;
                return res.json(docs);
            })
    }

    this.findDocById = (req, res) => {
        let id = req.query.id;
        Pk.findById(ObjectId(id), (err, doc) => {
            if (err) throw err;
            if (doc) {
                return res.json(doc)
            } else res.send('Hittade ingen post med det ID:t')
        })
    }

    this.isLoggedIn = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.send('You need to log in to post!')
        }
    }

    this.getLastPkUpdate = (req, res) => {
        PkTimestamp.findOne({})
            .exec((err, docs) => {
                if (err) throw err;
                //if timestamp is empty, we create it to return something
                if (docs === null) {
                    return res.json({ 'timestamp': null })
                }
                return res.json(docs);
            })
    }

    /**
     * Posts a timestamp to the db
     */
    this.setLastPkUpdate = () => {
        PkTimestamp.update({ name: 'timestamp' }, { 'timestamp': Date.now() }, { upsert: true, setDefaultsOnInsert: true },
            (err, result) => {
                if (err) throw err;
                console.log('wrote to last updated', result)
            });
    }
}

module.exports = ApiController;
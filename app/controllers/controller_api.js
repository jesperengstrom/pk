'use strict';
//importing mongoose.model = constructor
const Pk = require('../models/pk');
const PkTimestamp = require('../models/pk_timestamp');

function ApiController() {
    const ObjectId = require('mongodb').ObjectID;

    this.addDoc = (req, callback) => {
        let reqBody = req.body;
        let addObj = makePkObj(reqBody);

        addObj.created = {
            'date': Date.now(),
            'user': req.user.username
        };
        addObj.updated = {
            'date': null,
            'user': null
        };

        Pk.create(addObj, (err, res) => {
            this.handleErrors(err, res, callback);
        });
    }

    this.updateDoc = (req, callback) => {
        let reqBody = req.body;
        let updateObj = makePkObj(reqBody);
        updateObj.updated = {
            'date': Date.now(),
            'user': req.user.username
        };

        let id = req.query.id;

        Pk.update({ _id: ObjectId(id) }, updateObj, (err, res) => {
            this.handleErrors(err, res, callback);
        })
    }


    //The list of docs used to render timeline & map
    this.getDocList = (req, res) => {
        Pk.find({})
            .select('_id title obsDate obsLocation tags') //we only need these fields
            .exec((err, docs) => {
                if (err) {
                    console.log('error getting the obs list!', err);
                    return res.send('error getting the obs list!')
                }
                return res.json(docs);
            })
    }

    this.findDocById = (req, res) => {
        let id = req.query.id;
        Pk.findById(ObjectId(id), (err, doc) => {
            if (err) {
                console.log('error getting findbyid!', err);
                return res.send('error!');
            }
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
                if (err) {
                    console.log('Error getting last pk update!', err);
                    return res.send('Error getting last pk update!')
                }
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
                if (err) {
                    console.log('error updating pk timestamp', err)
                } else {
                    console.log('updated pk timestamp', result)
                }
            });
    }

    this.handleErrors = (err, result, callback) => {
        if (err) {
            let res = { status: 400, success: false, msg: 'Ett fel har inträffat. Informationen postades inte. Försök att tyda vad problemet är i meddelandet nedan, eller rapportera till palmekartan@hotmail.com för hjälp.', err: err };
            console.log('Error updating!', err);
            return callback(res);
        } else {
            let res = { status: 200, success: true, msg: 'Observationen har postats!', err: false }
            console.log('Updated PK: ', result);
            return callback(res);
        }
    }
}

module.exports = ApiController;

/**
 * Returns a formatted Pk db object for create & update
 * @param {object} reqBody 
 */
function makePkObj(reqBody) {
    return {
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
            'protocols': constructProtcolArray(),
            'followUp': reqBody['follow-up']
        },
        'opLocation': {
            'coords': {
                'lat': reqBody['palme-lat'],
                'lng': reqBody['palme-lng']
            }
        },
        'other': reqBody.other,
        'tags': reqBody.tags,
        'sources': constructSourceArray()
    };

    //makePkObj helper functions: 

    /**
     * Formats protocol arrs as [{date, url}, {date:url}] 
     * since req.body delivers multi entries as [date, date] [url, url]
     * single entries are just sent as 'date', 'url', so need to handle them too
     */
    function constructProtcolArray() {
        if (typeof reqBody['protocol-date'] === 'string') {
            return [{ 'date': new Date(reqBody['protocol-date']), 'url': reqBody['protocol-url'] }]
        } else {
            let array = [];
            for (let i in reqBody['protocol-date']) {
                array.push({
                    'date': new Date(reqBody['protocol-date'][i]),
                    'url': reqBody['protocol-url'][i]
                })
            }
            return array;
        }
    }

    //refactor 2 combine this & above?
    function constructSourceArray() {
        if (typeof reqBody['source-name'] === 'string') {
            return [{ 'name': reqBody['source-name'], 'url': reqBody['source-url'] || null }]
        } else {
            let array = [];
            for (let i in reqBody['source-name']) {
                array.push({
                    'name': reqBody['source-name'][i],
                    'url': reqBody['source-url'][i] || null
                })
            }
            return array;
        }
    }
}
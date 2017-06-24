'use strict';
//importing mongoose.model = constructor
const Pk = require('../models/pk');
const PkTimestamp = require('../models/pk_timestamp');

function ApiController() {
    const ObjectId = require('mongodb').ObjectID;

    this.addDoc = (req) => {
        let reqBody = req.body,
            name = reqBody.name,
            obsDate = new Date(reqBody['obs-date'] + " " + reqBody['obs-time']),
            lat = reqBody.lat,
            lng = reqBody.lng,
            created = Date.now(),
            user = req.user.username
        Pk.create({ 'name': name, 'obsDate': obsDate, 'coords': { 'lat': lat, 'lng': lng }, 'created': { 'date': created, 'user': user }, 'updated': { 'date': null, 'user': null } }),
            (err, res) => {
                if (err) throw err;
            };
    }

    this.updateDoc = (req) => {
        let reqBody = req.body,
            id = req.query.id,
            name = reqBody.name,
            obsDate = new Date(reqBody['obs-date'] + " " + reqBody['obs-time']),
            lat = reqBody.lat,
            lng = reqBody.lng,
            user = req.user.username,
            updated = Date.now();
        Pk.update({ _id: ObjectId(id) }, { 'name': name, 'obsDate': obsDate, 'coords': { 'lat': lat, 'lng': lng }, 'updated': { 'date': updated, 'user': user } }, (err, result) => {
            if (err) throw err;
            console.log('Updated PK: ', result);
        })
    }

    //The list of docs used to render timeline & map
    this.getDocList = (req, res) => {
        Pk.find({})
            .select('_id name obsDate coords') //we only need these fields
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
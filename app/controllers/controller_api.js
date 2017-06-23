'use strict';
//importing mongoose.model = constructor
const Pk = require('../models/pk');
const PkTimestamp = require('../models/pk_timestamp');

function ApiController() {
    const ObjectId = require('mongodb').ObjectID;

    //modify to real datetime
    this.addDocu = (form) => {
        let name = form.name,
            obsDate = new Date(form['obs-date'] + " " + form['obs-time']),
            lat = form.lat,
            lng = form.lng,
            created = Date.now(),
            updated = null
        Pk.create({ 'name': name, 'obsDate': obsDate, 'coords': { 'lat': lat, 'lng': lng }, 'created': created, 'updated': updated }),
            (err, res) => {
                if (err) throw err;
            };
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

    this.getFullDoc = (req, res) => {
        let id = req.params.id;
        Pk.find(ObjectId(id))
            .exec((err, docs) => {
                if (err) throw err;
                return res.json(docs)
            })
    }

    //try 2 get this one to work
    // this.getFullDoc = (req, res) => {
    //     let id = req.params.id;
    //     Pk.findById(id, (err, doc) => {
    //         if (err) res.send(err)
    //         if (doc) return res.json(doc)
    //         else res.send("No kitten found with that ID")
    //     });
    // }


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

    this.setLastPkUpdate = () => {
        PkTimestamp.update({ name: 'timestamp' }, { 'timestamp': Date.now() }, { upsert: true, setDefaultsOnInsert: true },
            (err, numaffected) => {
                if (err) throw err;
                console.log(numaffected)
            });
    }
}

module.exports = ApiController;
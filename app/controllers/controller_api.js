'use strict';
//importing mongoose.model = constructor
const Pk = require('../models/pk');

function ApiController() {
    const ObjectId = require('mongodb').ObjectID;

    //modify to real datetime
    this.addDocu = (form) => {
        let name = form.name,
            lat = form.lat,
            lng = form.lng,
            date = form['obs-date'],
            time = form['obs-time'];
        Pk.create({ 'name': name, 'dateTime': { 'date': date, 'time': time }, 'coords': { 'lat': lat, 'lng': lng } }),
            (err, res) => {
                if (err) throw err;
                console.log(res)
            };
    }

    //get all docs from db
    //function gets sent the response callback so it can return it with the docs
    this.getDocList = (req, res) => {
        Pk.find({}).exec((err, docs) => {
            if (err) throw err;
            return res.json(docs);
        })
    }

    this.getFullDoc = (req, res) => {
        let id = req.params.id;
        Pk.find(ObjectId(id)).exec((err, docs) => {
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

}

module.exports = ApiController;
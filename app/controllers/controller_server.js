'use strict';
//constructor

//importing mongoose.model
const Pk = require('../models/pk.js');

// function ServerController(db) {
function ServerController() {
    // const pk = db.collection('pk');
    const ObjectId = require('mongodb').ObjectID;

    //old post form to db
    // this.addDocu = (form) => {
    //     let name = form.name,
    //         lat = form.lat,
    //         lng = form.lng,
    //         date = form['obs-date'],
    //         time = form['obs-time'];
    //     pk.insert({ 'name': name, 'dateTime': { 'date': date, 'time': time }, 'coords': { 'lat': lat, 'lng': lng } }).
    //     exec((err, res) => {
    //         if (err) throw err;
    //         console.log(res)
    //     });
    // }

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

    //old
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
}

module.exports = ServerController;
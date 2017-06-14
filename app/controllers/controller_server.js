//constructor
function ServerController(db) {
    const pk = db.collection('pk');
    const ObjectId = require('mongodb').ObjectID;

    //post form to db
    this.addDocu = (form) => {
        let name = form.name,
            lat = form.lat,
            lng = form.lng,
            date = form['obs-date'],
            time = form['obs-time'];
        pk.insert({ 'name': name, 'dateTime': { 'date': date, 'time': time }, 'coords': { 'lat': lat, 'lng': lng } }, (err, res) => {
            if (err) throw err;
            console.log(res)
        })
    }

    //get all docs from db
    //function gets sent the response callback so it can return it with the docs
    this.getDocList = (req, res) => {
        pk.find({}).toArray((err, docs) => {
            if (err) throw err;
            return res.json(docs);
        })
    }

    this.getFullDoc = (req, res) => {
        let id = req.params.id;
        pk.find(ObjectId(id)).toArray((err, docs) => {
            if (err) throw err;
            return res.json(docs)
        })
    }
}

module.exports = ServerController;
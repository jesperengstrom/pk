//constructor
function ServerController(db) {
    const pk = db.collection('pk');

    //post form to db
    this.addDocu = (form) => {
        let name = form.name,
            lat = form.lat,
            long = form.long,
            date = form['obs-date'],
            time = form['obs-time'];
        pk.insert({ 'name': name, 'dateTime': { 'date': date, 'time': time }, 'coords': { 'lat': lat, 'long': long } }, (err, res) => {
            if (err) throw err;
            console.log(res)
        })
    }

    //get all docs from db
    this.getDocList = (req, res) => {
        pk.find({}).toArray((err, docs) => {
            if (err) throw err;
            return res.json(docs);
        })
    }
}

module.exports = ServerController;
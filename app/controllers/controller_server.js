//constructor
function ServerController(db) {
    const pk = db.collection('pk');

    //post form to db
    this.addDocu = (form) => {
        let name = form.name;
        let lat = form.lat;
        let long = form.long;
        pk.insert({ 'name': name, 'coords': { 'lat': lat, 'long': long } }, (err, res) => {
            if (err) throw err;
            console.log(res)
        })
    }

    //get all docs from db
    this.getAllDocs = (req, res) => {
        pk.find({}).toArray((err, docs) => {
            if (err) throw err;
            return res.json(docs);


        })
    }
}

module.exports = ServerController;
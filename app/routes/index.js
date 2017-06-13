//Server-side. Handles routes / api requests

const bodyParser = require('body-parser')
const controller = require(process.cwd() + '/app/controllers/controller_server.js')

module.exports = function(app, db) {

    //new instance of controller object - all methods gets db
    const serverController = new controller(db);

    //posting
    app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
    app.post('/api/post.html', (req, res) => {
        serverController.addDocu(req.body);
        res.writeHead(302, { 'Location': '/' });
        res.end();
    });

    app.get('/api/all', (req, res) => {
        serverController.getDocList(req, res);
    })

    app.get('/api/search/:id', (req, res) => {
        serverController.getFullDoc(req, res);
    })

}
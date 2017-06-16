//Server-side. Handles routes / api requests
'use strict'

const bodyParser = require('body-parser')
const Controller = require(process.cwd() + '/app/controllers/controller_server.js')

// module.exports = function(app, db) {
module.exports = function(app) {

    //new instance of controller object - remove db new version
    // const serverController = new controller(db);
    const serverController = new Controller();

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
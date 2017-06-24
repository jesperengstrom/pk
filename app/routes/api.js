// const express = require('express');
const bodyParser = require('body-parser')
const Controller = require(process.cwd() + '/app/controllers/controller_api.js');

//use express.routes() instead
module.exports = function(app) {

    //new instance of controller object
    const apiController = new Controller();
    app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());

    app.post('/api/post', apiController.isLoggedIn, (req, res) => {
        apiController.setLastPkUpdate();
        apiController.addDoc(req);
        res.writeHead(302, { 'Location': '/' });
        res.end();
    });

    app.post('/api/update', apiController.isLoggedIn, (req, res) => {
        apiController.setLastPkUpdate();
        apiController.updateDoc(req);
        res.writeHead(302, { 'Location': '/' });
        res.end();
    });

    app.get('/api/all', (req, res) => {
        apiController.getDocList(req, res);
    })

    app.get('/api/search', (req, res) => {
        //if we search by id we only expect 1 result
        if (req.query.id) {
            apiController.findDocById(req, res);
        }
        //implement other searches here
    })

    //api endpoints to get time of last update
    app.get('/api/lastupdated', (req, res) => {
        apiController.getLastPkUpdate(req, res);
    })
}
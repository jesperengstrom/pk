// const express = require('express');
const bodyParser = require('body-parser')
const Controller = require(process.cwd() + '/app/controllers/controller_api.js');

//use express.routes() instead
module.exports = function(app) {

    //new instance of controller object
    const apiController = new Controller();
    app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());

    app.post('/api/post', apiController.isLoggedIn, (req, res) => {
        apiController.addDocu(req.body);
        res.writeHead(302, { 'Location': '/' });
        res.end();
    });

    app.get('/api/all', (req, res) => {
        apiController.getDocList(req, res);
    })

    app.get('/api/search/:id', (req, res) => {
        apiController.getFullDoc(req, res);
    })

}
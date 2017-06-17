// const express = require('express');
const bodyParser = require('body-parser')
const Controller = require(process.cwd() + '/app/controllers/controller_server.js');

//use express.routes() instead
module.exports = function(app) {

    //new instance of controller object
    const serverController = new Controller();
    app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());

    app.post('/api/post', (req, res) => {
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
'use strict'
//serving non-user routes
const router = require('express').Router();
const Controller = require(process.cwd() + '/app/controllers/controller_server.js');
const userController = new Controller();

router.get('/', (req, res, next) => {
    res.render('index', userController.renderParams('hem', req.user))
})

module.exports = router;
//public routes
'use strict'

const router = require('express').Router();
const Controller = require(process.cwd() + '/app/controllers/controller_users.js');
const userController = new Controller();

router.get('/', (req, res, next) => {
    let params = userController.renderParams(req.flash('error'), req.user, 'Hem', true);
    res.render('index', params)
})

router.get('/about', (req, res, next) => {
    let params = userController.renderParams(req.flash('error'), req.user, 'Om');
    res.render('about', params)
})

module.exports = router;
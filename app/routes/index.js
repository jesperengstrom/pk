//public routes
'use strict'

const router = require('express').Router();
const Controller = require(process.cwd() + '/app/controllers/controller_users.js');
const userController = new Controller();

router.get('/', (req, res, next) => {
    let params = userController.renderParams(req.flash('error'), req.user, 'Hem', true);
    res.render('index', params)
})

router.get('/observation', (req, res, next) => { //same as index but has url param for displaying a single obs...
    let params = userController.renderParams(req.flash('error'), req.user, 'Hem', true);
    res.render('index', params)
})

router.get('/filter', (req, res, next) => { //same as index but has url param for displaying a single obs...
    let params = userController.renderParams(req.flash('error'), req.user, 'Filtrera', true);
    res.render('index', params)
})

router.get('/about', (req, res, next) => {
    let params = userController.renderParams(req.flash('error'), req.user, 'Om', true);
    res.render('index', params)
})

module.exports = router;
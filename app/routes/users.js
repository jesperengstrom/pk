//user routes
'use strict';

const passport = require('passport');
const router = require('express').Router();
const User = require('../models/user');
const Controller = require(process.cwd() + '/app/controllers/controller_users.js');
const userController = new Controller();

//LOGIN
router.get('/login', (req, res, next) => {
    let params = userController.renderParams(req.flash('error'), req.user, 'Logga in');
    res.render('login', params);
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}))

//LOGOUT
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

//LOGGED IN ROUTES
router.get('/addform', userController.isLoggedIn, (req, res) => {
    let params = userController.renderParams(req.flash('error'), req.user, 'Lägg till observation');
    res.render('addform', params);
});

//ADMIN ROUTES
router.get('/register', userController.isAdmin, (req, res, next) => {
    let params = userController.renderParams(req.flash('error'), req.user, 'Registrera användare');
    res.render('register', params);
});

router.post('/register', userController.isAdmin, (req, res, next) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message)
            return res.redirect('/users/register')
        }
        console.log('Användare registrerad!');
        res.redirect('/');
    })
});

module.exports = router;
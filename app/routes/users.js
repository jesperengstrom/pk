'use strict';
//serving user routes
const passport = require('passport');
const router = require('express').Router();
const User = require('../models/user');
const Controller = require(process.cwd() + '/app/controllers/controller_server.js');
const userController = new Controller();

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else {
        console.log('No permission');
        res.redirect('/');
    }
}


//REGISTER
router.get('/register', (req, res, next) => {
    res.render('register', userController.renderParams('Registrera användare', req.user));
});

router.post('/register', (req, res, next) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log('Fel vid registrering!', err, user)
            return next(err);
        }
        console.log('Användare registrerad!');
        res.redirect('/');
    })
});

//LOGIN
router.get('/login', (req, res, next) => {
    res.render('login', userController.renderParams('Logga in', req.user));
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    console.log('Inloggad!');
    res.redirect('/');
});

//LOGOUT
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

//LOGGED IN
router.get('/addform', isLoggedIn, (req, res) => {
    res.render('addform', userController.renderParams('Lägg till observation', req.user));
});

module.exports = router;
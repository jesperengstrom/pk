'use strict';
//serving user routes
const passport = require('passport');
const router = require('express').Router();
const User = require('../models/user');

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else {
        console.log('No permission');
        res.redirect('/');
    }
}

//REGISTER USER
router.get('/register', (req, res, next) => {
    res.render('register', { title: 'Registera konto' });
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
    res.render('login', { title: 'Logga in' });
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    console.log('Inloggad!');
    res.redirect('/');
});


//LOGGED IN
router.get('/addform', isLoggedIn, (req, res) => {
    res.render('addform', { title: 'Lägg till observation' });
});

module.exports = router;
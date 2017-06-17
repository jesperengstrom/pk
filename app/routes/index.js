'use strict'

//setting routes for my template pages
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index', { title: 'Hem' })
})

router.get('/login.html', (req, res, next) => {
    res.render('login', { title: 'Logga in' });
});

router.get('/user/register.html', (req, res, next) => {
    res.render('register', { title: 'Registera konto' });
});

router.get('/user/form.html', isLoggedIn, (req, res) => {
    res.render('form', { title: 'Lägg till observation' });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
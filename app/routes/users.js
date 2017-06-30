//user routes
'use strict';

const passport = require('passport');
const router = require('express').Router();
const User = require('../models/user');
const Controller = require(process.cwd() + '/app/controllers/controller_users.js');
const userController = new Controller();

var dateFormat = require('dateformat');

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
    // router.get('/addform', (req, res) => {
    let params = userController.renderParams(req.flash('error'), req.user, 'Lägg till post');
    res.render('addform', params);
});

router.get('/editlist', userController.isLoggedIn, (req, res) => {
    let params = userController.renderParams(req.flash('error'), req.user, 'Listar poster');
    res.render('editlist', params);
});

// router.get('/editform', userController.isLoggedIn, (req, res) => {
router.get('/editform', (req, res) => {
    let id = req.query.id;
    userController.getPost(id, (post) => {
        let params = userController.renderParams(req.flash('error'), req.user, 'Redigera post');
        params.form = post[0]; //saving the db result in my render params

        params.form.categoryHtml = renderTagsHtml();
        //parsing the fucking date back to form, creating new props
        params.form.parsedObsdate = dateFormat(post[0].obsDdate, 'isoDate')
        params.form.parsedObstime = dateFormat(post[0].obsDate, 'isoTime')
        params.form.parsedCalledindate = dateFormat(post[0].policeContacts.calledIn, 'isoDate')
        params.form.parsedProtocols = [];
        for (let i = 0; i < params.form.policeContacts.protocols.length; i++) {
            params.form.parsedProtocols.push({
                'date': dateFormat(params.form.policeContacts.protocols[i].date, 'isoDate'),
                'url': params.form.policeContacts.protocols[i].url
            });
        }

        /**
         * renders the tags boxes to check the right ones. Kinda ugly, should be done with array.some
         */
        function renderTagsHtml() {
            let match = false;
            let result = ``;
            const tags = ['Mordkvällen', 'Walkie Talkie', 'Möjlig övervakare', 'Förföljare', 'Grand', 'Gamla Stan', 'Bil'];
            tags.forEach((el) => {
                result += `<div class="form-check form-check-inline"><label class="form-check-label">`;
                params.form.tags.forEach((e) => {
                    if (el === e) {
                        match = true;
                    }
                }, this);
                if (match) result += `<input class="form-check-input" type="checkbox" name="tags" value="${el}" checked> ${el}`;
                else result += `<input class="form-check-input" type="checkbox" name="tags" value="${el}"> ${el}`;
                result += `</label></div>`;
                match = false;
            }, this);
            return result;
        }

        res.render('editform', params);
    });
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
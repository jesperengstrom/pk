'use strict';

function UserController() {

    //returns an object to Handlebars to render pages
    this.renderParams = (err, user, title, isIndex) => {
        let admin = false;
        let index = false;
        let username;
        if (user) {
            username = user.username;
            admin = user.local.isAdmin;
        }
        if (isIndex) {
            index = true;
        }
        return {
            error: err || "",
            title: title,
            loggedin: user,
            username: username,
            admin: admin,
            index: index
        };
    }

    this.isLoggedIn = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            console.log('No permission');
            res.redirect('/');
        }
    }

    this.isAdmin = (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.local.isAdmin) {
                return next();
            }
        }
        res.redirect('/');
    }

    //try replace this with identical api method
    this.getPost = (id, res) => {
        const Pk = require('../models/pk');
        const ObjectId = require('mongodb').ObjectID;
        Pk.find(ObjectId(id))
            .exec((err, doc) => {
                if (err) throw err;
                return res(doc)
            })
    }
}

module.exports = UserController;
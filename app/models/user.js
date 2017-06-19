'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    local: {
        username: String,
        password: String
    }
}, { collection: 'users' })

//add the passport-local-mongoose plugin
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
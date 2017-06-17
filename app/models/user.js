'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt-nodejs')

const User = new Schema({
    local: {
        username: String,
        password: String
    }
}, { collection: 'users' })

//add the passport-local-mongoose plugin
User.plugin(passportLocalMongoose);

//this schema's methods
// User.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
// }

// User.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password)
// }

module.exports = mongoose.model('User', User);
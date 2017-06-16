'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')

var Schema = mongoose.Schema;

var User = new Schema({
    local: {
        username: String,
        password: String
    }
}, { collection: 'users' })

//this schema's methods
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', User);
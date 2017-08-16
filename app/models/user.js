'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const options = {
    errorMessages: {
        UserExistsError: 'En användare med det användarnamnet finns redan',
        IncorrectPasswordError: 'Felaktigt lösenord eller användarnamn',
        IncorrectUsernameError: 'Felaktigt lösenord eller användarnamn'
    },
    limitAttempts: true,
    maxAttempts: 10
}

const User = new Schema({
    local: {
        username: {
            type: String,
            // unique: true //removed - E11000 duplicate key error
        },
        password: {
            type: String
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }
}, { collection: 'users' })

//add the passport-local-mongoose plugin
User.plugin(passportLocalMongoose, options);

module.exports = mongoose.model('User', User);
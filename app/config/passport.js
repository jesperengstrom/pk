const User = require('../models/user.js');

module.exports = function(passport) {
    //Create the local strategy
    passport.use(User.createStrategy());
    //Used to set the user to the cookie, save to session
    passport.serializeUser(User.serializeUser());
    //Used to get the user from the cookie, get the session
    passport.deserializeUser(User.deserializeUser());
}
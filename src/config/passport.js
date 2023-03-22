const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


 
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
 
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
 
passport.use(new FacebookStrategy({
    clientID: "880261419941182",
    clientSecret:"5a516e1c7ff3496ade575067f40335e1",
    callbackURL: "http://localhost:3000/auth/facebook/callback"

}, 
function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));
 

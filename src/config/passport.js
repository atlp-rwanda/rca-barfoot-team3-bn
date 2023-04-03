const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

passport.use(new FacebookStrategy(
  {
    clientID: '880261419941182',
    clientSecret: '5a516e1c7ff3496ade575067f40335e1',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'

  },
  ((accessToken, refreshToken, profile, done) => done(null, profile))
));
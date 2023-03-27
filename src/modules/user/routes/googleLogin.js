const passport = require('passport');

module.exports = {
  getGoogleLogin: [passport.authenticate('google', { scope: ['profile'] })],

  handleGoogleLogin: [
    passport.authenticate('google', {
      failureRedirect: '/login'
    }),
    function (req, res) {
      res.redirect('/');
    }
  ]
};

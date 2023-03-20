const passport = require('passport');

module.exports = {
  getFacebookLogin: [passport.authenticate('facebook', { scope: ['profile'] })],

  handleFacebookLogin: [
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }),
    function (req, res) {
      res.redirect('/');
    }
  ]
};

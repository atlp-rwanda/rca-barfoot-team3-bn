const passport = require('passport');

module.exports = {
  getLogin: (req) => {
    const isLoginFailed = typeof req.query.login_failed !== 'undefined';
    if (isLoginFailed) {
      req.flash('validation_errors', [{ msg: 'Login has failed.' }]);
    }
  },

  postLogin: [
    passport.authenticate('local', { failureRedirect: 'login?login_failed' }),
    (req, res) => {
      res.redirect('/');
    }
  ],

  handleLogout: (req, res) => {
    req.logout();
    res.redirect('/');
  }
};

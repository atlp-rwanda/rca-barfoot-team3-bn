const passport = require('passport');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index.ejs'); // load the index.ejs file
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('pages/profile.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

router.get('/error', isLoggedIn, (req, res) => {
  res.render('pages/error.ejs');
});

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/error'
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;

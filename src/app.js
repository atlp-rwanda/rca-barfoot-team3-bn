const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const routes = require('./modules/user/routes/facebookLogin');
require("./config/passport")
require('dotenv').config(); 
const { dbClient } = require('./database/index');
const usersRouter = require('./modules/user/routes');
app.set('view engine', 'ejs');
 
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

 
app.use('/', routes);
 
const port = 3000;
 
app.listen(port, () => {
    console.log('Example app listening on port ' + port);
});

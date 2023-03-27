const express = require('express');

const app = express();
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDocs = require('swagger-jsdoc');
const routes = require('./modules/user/routes/facebookLogin');
require('./config/passport');
require('dotenv').config();
const { dbClient } = require('./database/index');
const usersRouter = require('./modules/user/routes');
const roleRoutes = require('./modules/role/routes');
const permissionRoutes = require('./modules/permission/routes');

const accommodationRouter = require('./modules/accommodations/routes');
const swaggerConfig = require('../swagger.json');
const bookingRoute = require('./modules/booking/routes');

const swaggerDocs = swaggerJsDocs(JSON.parse(JSON.stringify(swaggerConfig)));

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => { res.send(`${process.env.MESSAGE}`); });

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/accommodations', accommodationRouter);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/permissions', permissionRoutes);
app.use('/api/v1/booking/', bookingRoute);
app.use('/', routes);

app.listen(PORT, () => {
  dbClient.connect().then(() => {
    console.log('Connected to db');
    app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, false, { docExpansion: 'none' }));
    console.log(`Example app listening on port ${PORT}!`);
  });
});

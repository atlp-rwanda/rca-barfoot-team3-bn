/* eslint no-underscore-dangle: 0 */

const express = require('express');
const cors = require('cors');

const app = express();
const passport = require('passport');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDocs = require('swagger-jsdoc');
const routes = require('./modules/user/routes/facebookLogin');
require('./config/passport');
require('dotenv').config();
const { dbClient } = require('./database/index');
const usersRouter = require('./modules/user/routes');
const roleRoutes = require('./modules/role/routes');
const permissionRoutes = require('./modules/permission/routes');
const { accomodationRoutes, roomsRoutes } = require('./modules/accommodation/routes');
const notificationRoutes = require('./modules/notification/routes');

const tripRoute = require('./modules/trip/routes');
const swaggerConfig = require('../swagger.json');
const i18n = require('./config/i18n');
const bookingRoute = require('./modules/booking/routes');
const hotelRoute = require('./modules/hotel/routes');
const { fileRouter } = require('./modules/file/routes');

const swaggerDocs = swaggerJsDocs(JSON.parse(JSON.stringify(swaggerConfig)));
app.use(express.json());
app.use(passport.initialize());
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(cors());
app.use(i18n.init);

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => { res.send({ message: res.__('greetings'), language: req.get('accept-language') }); });
app.get('/', (req, res) => { res.send(`${process.env.MESSAGE}`); });

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/hotels', hotelRoute);
app.use('/api/v1/accommodations', accomodationRoutes);
app.use('/api/v1/rooms', roomsRoutes);
app.use('/api/v1/trip', tripRoute);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/permissions', permissionRoutes);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/notification/', notificationRoutes);
app.use('/api/v1/files/', fileRouter);

app.use('/', routes);

app.listen(PORT, () => {
  dbClient.connect().then(() => {
    console.log('Connected to db', process.env.DB_NAME);
    app.use(
      '/v1/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocs, false, { docExpansion: 'none' })
    );
    console.log(`Example app listening on port ${PORT}!`);
  });
});

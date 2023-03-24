const express = require('express'); require('dotenv').config(); const swaggerUi = require('swagger-ui-express'); const swaggerJsDocs = require('swagger-jsdoc'); const { dbClient } = require('./database/index');
const usersRouter = require('./modules/user/routes');
const accommodationRouter = require('./modules/accommodations/routes');
const swaggerConfig = require('../swagger.json');

const swaggerDocs = swaggerJsDocs(JSON.parse(JSON.stringify(swaggerConfig))); const app = express(); app.use(express.json()); const PORT = process.env.PORT || 3000; app.get('/', (req, res) => { res.send(`${process.env.MESSAGE}`); });
app.use('/api/v1/users', usersRouter); app.use('/api/v1/accommodations', accommodationRouter); app.listen(PORT, () => { dbClient.connect().then(() => { console.log('Connected to db'); app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, false, { docExpansion: 'none' })); console.log(`Example app listening on port ${PORT}!`); }); });

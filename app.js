const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');
require('dotenv').config();

require('./v1/services/initDb');
const versions = require('./versioningRoutes/v1');
const log = require('./v1/middleware/logger');
const errorHandler = require('./v1/middleware/errorHandler');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));

app.use('/api', versions);
app.use(errorHandler);
app.use((req, res, next) => {
  return res.status(404).send({
    success: false,
    error: 'Not found',
  });
});

const server = app.listen(PORT, () => {
  const { address, port } = server.address();
  log.info('App listening at http://%s:%s', address, port);
});

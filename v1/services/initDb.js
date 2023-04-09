const mongoose = require('mongoose');
const log = require('../middleware/logger');
const dbURI = process.env.DB_URI + process.env.DB_NAME;

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
  log.info('Mongoose default connection open to ' + dbURI);
});

mongoose.connection.on('error', (err) => {
  log.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  log.info('Mongoose default connection disconnected');
  mongoose.connect(dbURI, { server: { auto_reconnect: true } });
});

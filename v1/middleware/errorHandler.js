const validator = require('express-validation');

const log = require('../middleware/logger');

/**
 * Common error handler for all the APIs
 * @param  {} err Errors thrown from functions
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const errorHandler = (err, req, res, next) => {
  if (err) {
    if (err instanceof validator.ValidationError) {
      log.error(JSON.stringify(err));
      return res.status(400).send({
        status: false,
        error: JSON.stringify(err),
      });
    } else {
      log.error(err);
      return res.status(500).send({
        status: false,
        error: err.toString(),
      });
    }
  } else {
    next();
  }
};

module.exports = errorHandler;

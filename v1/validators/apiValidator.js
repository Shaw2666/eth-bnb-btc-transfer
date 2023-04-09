const { Joi } = require('express-validation');

const config = require('../config/config');

const schema = {
  ethTransfer: {
    body: Joi.object({
      address: Joi.string().length(42).required(),
      amount: Joi.number().required(),
    }),
  },
  btcTransfer: {
    body: Joi.object({
      address: Joi.string().required(),
      amount: Joi.number()
        .greater(config.btc.transferFee / 100000000)
        .required(),
    }),
  },
};

module.exports = schema;

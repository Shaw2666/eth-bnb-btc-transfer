const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/config');

const accountSchema = new Schema(
  {
    address: String,
  },
  { strict: false }
);

const ETHAccount = mongoose.model(config.eth.accountCollection, accountSchema);
const BTCAccount = mongoose.model(config.btc.accountCollection, accountSchema);
const BNBAccount = mongoose.model(config.bnb.accountCollection, accountSchema);

module.exports = { ETHAccount, BTCAccount, BNBAccount };

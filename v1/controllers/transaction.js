const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');

const config = require('../config/config');
const { etherTransfer, btcTransfer, bnbTransfer } = require('../services/transferService');
const validator = require('../validators/apiValidator');

/**
 * To transfer Ether from admin wallet to specified address
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const etherTransaction = async (req, res, next) => {
  try {
    let toWallet = req.body.address;
    let fromWallet = config.eth.adminWallet;
    let amount = req.body.amount;
    let txHash = await etherTransfer(fromWallet, toWallet, amount);
    return res.send({
      success: true,
      txHash: txHash.transactionHash,
      result: 'Transaction Successfull.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * To transfer Bitcoin from admin wallet to specified address
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const btcTransaction = async (req, res, next) => {
  try {
    let toWallet = req.body.address;
    let fromWallet = config.btc.adminWallet;
    let amount = req.body.amount;
    let txHash = await btcTransfer(fromWallet, toWallet, amount);
    return res.send({
      success: true,
      txHash: txHash,
      result: 'Transaction Successfull.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * To transfer Binance coin from admin wallet to specified address
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const bnbTransaction = async (req, res, next) => {
  try {
    let toWallet = req.body.address;
    let fromWallet = config.bnb.adminWallet;
    let amount = req.body.amount;
    let txHash = await bnbTransfer(fromWallet, toWallet, amount);
    return res.send({
      success: true,
      txHash: txHash.transactionHash,
      result: 'Transaction Successfull.',
    });
  } catch (err) {
    next(err);
  }
};

router.post('/transfer/eth', validate(validator.ethTransfer), etherTransaction);

router.post('/transfer/btc', validate(validator.btcTransfer), btcTransaction);

router.post('/transfer/bnb', validate(validator.ethTransfer), bnbTransaction);

module.exports = router;

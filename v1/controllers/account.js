const express = require('express');
const router = express.Router();
const log = require('log4js').getLogger('account');

const collection = require('../models/account.js');
const { generateKeyPair, getBtcClient } = require('../services/btcUtils');
const { addressGenerator } = require('../services/ethUtils');

/**
 * To create Admin wallet for Ethereum transfer and store the details in the DB
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const createEthAdmin = async (req, res, next) => {
  try {
    const adminDetails = addressGenerator();
    const ethAccCollection = new collection.ETHAccount(adminDetails);
    ethAccCollection.save();

    log.info('Added ethereum admin account details to DB');

    return res.send({
      success: true,
      result: {
        address: adminDetails.address,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * To create keypair(admin) for Bitcoin transfer and store it in the DB
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const createBtcAdmin = async (req, res, next) => {
  try {
    const { keyPair, address } = generateKeyPair();
    const btcClient = getBtcClient();

    await btcClient.importaddress({
      address,
      label: 'Admin',
      rescan: false,
    });

    log.info('Address imported', {
      address,
      label: 'Admin',
    });

    let AccCollection = new collection.BTCAccount({
      address,
      private: keyPair.toWIF(),
    });
    await AccCollection.save();
    log.info('Added bitcoin admin account details to DB');

    return res.send({ success: true, result: { address } });
  } catch (error) {
    next(error);
  }
};

/**
 * To create Admin wallet for Binance Coin transfer and store the details in the DB
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const createBnbAdmin = async (req, res, next) => {
  try {
    const adminDetails = addressGenerator();
    const bnbAccCollection = new collection.BNBAccount(adminDetails);
    bnbAccCollection.save();

    log.info('Added binance admin account details to DB');

    return res.send({
      success: true,
      result: {
        address: adminDetails.address,
      },
    });
  } catch (err) {
    next(err);
  }
};

router.get('/createAccount/eth', createEthAdmin);
router.get('/createAccount/btc', createBtcAdmin);
router.get('/createAccount/bnb', createBnbAdmin);
module.exports = router;

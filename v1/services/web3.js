const Web3 = require('web3');

const config = require('../config/config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.eth.rpcURL));

const web3_bsc = new Web3(new Web3.providers.HttpProvider(config.bnb.rpcURL));

module.exports = { web3, web3_bsc };

const keythereum = require('keythereum');
const Common = require('@ethereumjs/common').default;
const Tx = require('@ethereumjs/tx').Transaction;
const bitcoinLib = require('bitcoinjs-lib');

const log = require('../middleware/logger');
const collection = require('../models/account.js');
const config = require('../config/config');
const { web3, web3_bsc } = require('./web3');
const { getBlockHash, getBtcClient, getKeyPairFromWIF, validator } = require('./btcUtils');

/**
 * To transfer Ether
 * @param  {} adminAddress
 * @param  {} toWallet
 * @param  {} value
 */
const etherTransfer = async (adminAddress, toWallet, value) => {
  const ethAccountCollection = collection.ETHAccount;
  const fromWallet = await ethAccountCollection.findOne({ address: adminAddress }).lean();
  if (!fromWallet) {
    throw Error('Please setup an Admin first!');
  }

  const privateKeyG = keythereum.recover(fromWallet.password, fromWallet.keystore);
  const privateKey = new Buffer.from(privateKeyG, 'hex');

  const nonce_count = await web3.eth.getTransactionCount(adminAddress);
  const gasLimit = config.eth.gasLimit;
  let gasPrice = await web3.eth.getGasPrice();
  gasPrice = parseInt(gasPrice) + 8000000000;

  const txObject = {};
  txObject.nonce = web3.utils.toHex(nonce_count);
  txObject.gasLimit = web3.utils.toHex(gasLimit);
  txObject.gasPrice = web3.utils.toHex(gasPrice);
  txObject.to = toWallet;
  txObject.from = adminAddress;
  const tAmount = web3.utils.toWei(value.toString()) - gasLimit * gasPrice;
  if (tAmount < 0) {
    throw Error('Please send higher amount');
  }
  txObject.value = web3.utils.toHex(tAmount);

  //Sign transaction before sending
  const common = new Common({ chain: config.eth.network });
  const tx = Tx.fromTxData(txObject, { common });
  const signedTx = tx.sign(privateKey);
  const serializedTx = signedTx.serialize();
  const txHex = '0x' + serializedTx.toString('hex');

  log.info('Transaction details', {
    from: adminAddress,
    to: toWallet,
    fee: gasLimit * gasPrice,
    value: tAmount,
    txHash: txHex,
  });

  const receipt = await web3.eth.sendSignedTransaction(txHex);

  log.info('Transaction Successfull ', receipt.transactionHash);

  return receipt;
};

/**
 * To transfer Bitcoin
 * @param  {} adminAddress
 * @param  {} toWallet
 * @param  {} value
 */
const btcTransfer = async (adminAddress, toWallet, value) => {
  const btcClient = getBtcClient();
  const network = bitcoinLib.networks[config.btc.network];
  const btcAccountCollection = collection.BTCAccount;
  const fromWallet = await btcAccountCollection.findOne({ address: adminAddress }).lean();
  if (!fromWallet) {
    throw Error('Please setup an Admin first!');
  }
  const keypair = getKeyPairFromWIF(fromWallet.private);
  const tx = new bitcoinLib.Psbt({ network });
  let balance = 0;

  const utxoConfig = { minconf: 1, maxconf: 100, addresses: [adminAddress], include_unsafe: false };
  const utxos = await btcClient.listunspent(utxoConfig);
  if (!utxos || !utxos.length) {
    throw Error('Waiting for last transaction confirmation');
  }

  await Promise.all(
    utxos.map(async (txn) => {
      const rawTxn = await getBlockHash(txn.txid);
      balance += txn.amount * 100000000;
      // check if it's a Segwit or Non-Segwit transaction
      const isSegwit = rawTxn.hex.substring(8, 12) === '0001';
      if (isSegwit) {
        tx.addInput({
          hash: txn.txid,
          index: txn.vout,
          witnessUtxo: {
            script: new Buffer.from(rawTxn.scriptPubKey, 'hex'),
            value: txn.amount * 100000000,
          },
        });
      } else {
        tx.addInput({
          hash: txn.txid,
          index: txn.vout,
          nonWitnessUtxo: new Buffer.from(rawTxn.hex, 'hex'),
        });
      }
    })
  );
  const investment = value * 100000000;
  const fee = config.btc.transferFee;
  const tAmount = parseInt(investment - fee);
  const rAmount = parseInt(balance - investment);
  if (rAmount < 0) {
    throw Error('Insufficient balance');
  }

  tx.addOutput({ address: toWallet, value: tAmount });
  tx.addOutput({ address: adminAddress, value: rAmount });
  await tx.signAllInputsAsync(keypair);
  tx.validateSignaturesOfAllInputs(validator);
  tx.finalizeAllInputs();
  const txhex = tx.extractTransaction().toHex();

  log.info('Transaction details', {
    from: adminAddress,
    to: toWallet,
    fee: fee,
    tAmount: tAmount,
    txHash: txhex,
  });

  const result = await btcClient.sendrawtransaction({ hexstring: txhex });

  log.info('Successfully completed transaction and the txid is: ', result);

  return result;
};

/**
 * To transfer BNB
 * @param  {} adminAddress
 * @param  {} toWallet
 * @param  {} value
 */
const bnbTransfer = async (adminAddress, toWallet, value) => {
  const bnbAccountCollection = collection.BNBAccount;
  const fromWallet = await bnbAccountCollection.findOne({ address: adminAddress }).lean();
  if (!fromWallet) {
    throw Error('Please setup an Admin first!');
  }

  const privateKeyG = keythereum.recover(fromWallet.password, fromWallet.keystore);
  const privateKey = new Buffer.from(privateKeyG, 'hex');

  const nonce_count = await web3_bsc.eth.getTransactionCount(adminAddress);
  const gasLimit = config.eth.gasLimit;
  let gasPrice = await web3_bsc.eth.getGasPrice();
  gasPrice = parseInt(gasPrice) + 8000000000;

  const txObject = {};
  txObject.nonce = web3_bsc.utils.toHex(nonce_count);
  txObject.gasLimit = web3_bsc.utils.toHex(gasLimit);
  txObject.gasPrice = web3_bsc.utils.toHex(gasPrice);
  txObject.to = toWallet;
  txObject.from = adminAddress;
  const tAmount = web3_bsc.utils.toWei(value.toString()) - gasLimit * gasPrice;
  if (tAmount < 0) {
    throw Error('Please send higher amount');
  }
  txObject.value = web3_bsc.utils.toHex(tAmount);

  //Sign transaction before sending
  const common = Common.custom({
    name: 'bnb',
    networkId: config.bnb.network === 'mainnet' ? 56 : 97,
    chainId: config.bnb.network === 'mainnet' ? 56 : 97,
  });

  const tx = Tx.fromTxData(txObject, { common });
  const signedTx = tx.sign(privateKey);
  const serializedTx = signedTx.serialize();
  const txHex = '0x' + serializedTx.toString('hex');

  log.info('Transaction details', {
    from: adminAddress,
    to: toWallet,
    fee: gasLimit * gasPrice,
    value: tAmount,
    txHash: txHex,
  });

  const receipt = await web3_bsc.eth.sendSignedTransaction(txHex);

  log.info('Transaction Successfull ', receipt.transactionHash);

  return receipt;
};

module.exports = { etherTransfer, btcTransfer, bnbTransfer };

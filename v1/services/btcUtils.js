const { RPCClient } = require('rpc-bitcoin');
const bitcoinLib = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');
const axios = require('axios');

const config = require('../config/config');

//Common variables
const ECPair = ECPairFactory(ecc);
const network = bitcoinLib.networks[config.btc.network];
let client;

/**
 * To generate keypair for Bitcoin transfer according to specific network
 */
const generateKeyPair = () => {
  const keyPair = ECPair.makeRandom({ network });
  if (!keyPair) {
    throw Error('Some issues on generating keypair');
  }
  const { address } = bitcoinLib.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network,
  });
  return { keyPair, address };
};

/**
 * To get key details from private key in wallet import form
 * @param  {} privkeyWif private key in wallet import form
 */
const getKeyPairFromWIF = (privkeyWif) => {
  return ECPair.fromWIF(privkeyWif, network);
};

/**
 * To get a Blockchain connected RPC Client
 */
const getBtcClient = () => {
  if (!client) {
    client = new RPCClient({
      url: config.btc.url,
      port: config.btc.port,
      user: config.btc.username,
      pass: config.btc.password,
    });
  }
  return client;
};

/**
 * To get Transaction details using public API
 * @param  {} txid Transaction ID
 */
const getBlockHash = async (txid) => {
  const url = config.btc.blockHashApi[config.btc.network];
  const result = await axios.get(url + `/${txid}?includeHex=true`);
  return result.data;
};

/**
 * Used to verify input signatures on transaction object
 * @param  {} pubkey
 * @param  {} msghash
 * @param  {} signature
 */
const validator = (pubkey, msghash, signature) => ECPair.fromPublicKey(pubkey).verify(msghash, signature);

module.exports = {
  generateKeyPair,
  getKeyPairFromWIF,
  getBtcClient,
  getBlockHash,
  validator,
};

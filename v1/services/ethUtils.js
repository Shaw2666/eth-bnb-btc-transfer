const keythereum = require('keythereum');
const log = require('log4js').getLogger('account');
const sha3_256 = require('js-sha3').sha3_256;

/**
 * Ethereum compatible address generator
 */
const addressGenerator = () => {
  const password = sha3_256(String(Math.floor(Math.random() * 100000000 + 1)));
  const params = { keyBytes: 32, ivBytes: 16 };
  const dk = keythereum.create(params);
  const options = {
    kdf: 'pbkdf2',
    cipher: 'aes-128-ctr',
    kdfparams: {
      c: 262144,
      dklen: 32,
      prf: 'hmac-sha256',
    },
  };
  let keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options);
  // keythereum.exportToFile(keyObject);
  let publicAddress = '0x' + keyObject.address;

  log.info({
    address: publicAddress,
    private: 'xxxxxxxxxxxxxxxxxxxxxxx',
    lastBlock: 0,
    lastBalance: 0,
    scheduler: 0,
    keystore: 'keyObject',
  });

  return {
    address: publicAddress,
    password: password,
    lastBlock: 0,
    lastBalance: 0,
    scheduler: 0,
    keystore: keyObject,
  };
};

module.exports = { addressGenerator };

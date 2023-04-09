const config = {
  eth: {
    accountCollection: process.env.ETH_COLLECTION_NAME,
    network: process.env.ETH_NETWORK || 'rinkeby',
    adminWallet: process.env.ETH_ADMIN_WALLET,
    rpcURL: process.env.ETH_RPC_URL,
    gasLimit: process.env.ETH_GAS_LIMIT || 80000,
  },
  btc: {
    accountCollection: process.env.BTC_COLLECTION_NAME,
    network: process.env.BTC_NETWORK || 'testnet',
    adminWallet: process.env.BTC_ADMIN_WALLET,
    url: process.env.BTC_URL,
    port: process.env.BTC_PORT || 18332,
    username: process.env.BTC_USERNAME,
    password: process.env.BTC_PASSWORD,
    timeout: process.env.BTC_TIMEOUT || 30000,
    transferFee: process.env.BTC_TRANSFER_FEE_IN_SAT || 1000, //In Satoshi
    blockHashApi: {
      testnet: 'https://api.blockcypher.com/v1/btc/test3/txs',
      mainnet: 'https://api.blockcypher.com/v1/btc/main/txs',
    },
  },
  bnb: {
    accountCollection: process.env.BNB_COLLECTION_NAME,
    network: process.env.BNB_NETWORK || 'testnet',
    adminWallet: process.env.BNB_ADMIN_WALLET,
    rpcURL: process.env.BNB_RPC_URL,
    gasLimit: process.env.BNB_GAS_LIMIT || 80000,
  },
};
module.exports = config;

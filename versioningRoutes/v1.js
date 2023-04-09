const express = require('express');
const router = express.Router();

let v1AccountAPIS = require('../v1/controllers/account');
let v1TransactionAPIS = require('../v1/controllers/transaction');

router.use('/v1', v1AccountAPIS);
router.use('/v1', v1TransactionAPIS);

module.exports = router;

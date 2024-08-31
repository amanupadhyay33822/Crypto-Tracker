const express = require('express');
const {getUser,fetchAndStoreEthereumPrice, getUserExpensesAndPrice} = require('../controller/User');
const router = express.Router();

router.get("/:address",getUser);
router.get("/price",fetchAndStoreEthereumPrice);
router.get("/expense/:address",getUserExpensesAndPrice);

module.exports = router;
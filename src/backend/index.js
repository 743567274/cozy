const express = require('express');
const router = express.Router();

router.use('/administrator', require('./user/index')); // 后端账户用户相关模块
router.use('/product', require('./product/index')); // 后端商品相关模块

module.exports = router;
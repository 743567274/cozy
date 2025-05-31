const express = require('express');
const router = express.Router();

router.use('/login', require('./login')); // 登录模块
router.use('/administrator', require('./administrator')); // 后端账户用户相关模块
router.use('/article', require('./article'));// 文章相关模块
router.use('/users', require('./users')); // 用户相关模块
router.use('/product', require('./product_class')); // 产品分类相关模块
router.use('/order', require('./order')); // 订单相关模块
router.use('/withdrawal', require('./withdrawal')); // 提现相关模块
router.use('/commission', require('./commission'));// 佣金相关模块

module.exports = router;
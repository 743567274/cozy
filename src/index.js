const express = require('express');
const router = express.Router();

router.use('/backend', require('./backend/index')); // 后台管理
router.use('/frontend', require('./frontend/index')); // 前台

module.exports = router;
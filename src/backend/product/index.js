const express = require('express');
const router = express.Router();

router.use('/product', require('../user/login'));

module.exports = router;
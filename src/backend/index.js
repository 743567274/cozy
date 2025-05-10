const express = require('express');
const router = express.Router();

router.use('/administrator', require('./user/index'));

module.exports = router;
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const CROS  = require('cors');
dotenv.config();
app.use(CROS(['*']));

app.use(express.json());// json 解析中间件
app.use('/api',require('./src/index'))

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
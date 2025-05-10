const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());// json 解析中间件
app.use('/api',require('./src/index'))

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
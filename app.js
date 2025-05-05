import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();

app.use(require('./src/index.ts'))

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
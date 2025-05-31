// 这里是上传文件的接口，直接返回七牛的上传地址
const express = require('express');
const router = express.Router();
const qiniu = require('qiniu');

const mac = new qiniu.auth.digest.Mac(process.env.accessKey, process.env.secretKey);

// 申请上传的token
router.post('/', async (req, res) => {
    const type = req.body.type; // 上传的文件类型，
    const filename = req.body.filename; // 上传的文件名
    let options = {
        scope: `${process.env.scope}:`, // 存储空间名
        expires: 7200, // 过期时间，单位秒
    }
    let putPolicy = new qiniu.rs.PutPolicy(options); // 创建上传策略
    let uploadToken = putPolicy.uploadToken(mac); // 获取上传token
    res.json({
        code: 200,
        success: true,
        data: uploadToken
    });
});

module.exports = router;
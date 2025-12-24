// 这里是上传文件的接口，直接返回七牛的上传地址
const express = require('express');
const router = express.Router();
const qiniu = require('qiniu');
// 导入时间定时
const moment = require('moment');

const mac = new qiniu.auth.digest.Mac(process.env.accessKey, process.env.secretKey);

// 申请上传的token
router.post('/', async (req, res) => {
    try {
        const { type, filename } = req.body;
        if (!type || !filename) {
            res.status(400).json({
                message: '参数错误',
                success: false
            });
        }
        let key = '';
        switch (type) {
            case 'article': // 文章图片
                key = `article/${filename}`;
                break;
            case 'screen': // 开屏海报
                key = `screen/${filename}`;
                break;
            case 'carousel': // 轮播图片
                key = `carousel/${filename}`;
                break;
            case 'product_main' || 'product_video': // 商品主图
                const { id } = req.body
                if (!id) {
                    return res.status(400).json({
                        message: '商品id不能为空',
                        success: false
                    });
                }
                key = `product_main/${id}/${filename}`;
                break;
            case 'phone_model_main': // 手机壳类型主图
                key = `phone/${filename}`;
                break;
        }

        let options = {
            scope: `${process.env.scope}:${key}`, // 存储空间名
            expires: 3600, // 过期时间，单位秒
        }
        let putPolicy = new qiniu.rs.PutPolicy(options); // 创建上传策略
        let uploadToken = putPolicy.uploadToken(mac); // 获取上传token
        res.json({
            code: 200,
            success: true,
            token: uploadToken,
            domain: process.env.Image_Server,
            key: key
        });
    } catch (error) {
        res.json({
            code: 500,
            success: false,
            message: '上传失败'
        });
    }
});

// 一天执行一次



module.exports = router;
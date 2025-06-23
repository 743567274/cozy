const express = require('express');
const router = express.Router();
const { Configured } = require('../../models');
const KEYS = {
    banners: 'banners', // 海报
    splash: 'splash',// 开屏广告
}

// 获取首页海报配置
router.get('/carousel', async (req, res) => {
    try {
        const result = await Configured.findOne({
            where: {
                key: KEYS.banners
            }
        });
        if (!result) {
            return res.status(200).json({
                message: '获取成功',
                success: true,
                data: []
            });
        }
        res.status(200).json({
            message: '获取成功',
            success: true,
            data: JSON.parse(result.value)
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
});
// 修改首页海报配置
router.post('/carousel', async (req, res) => {
    try {
        const { data } = req.body;
        // 先尝试查找
        const existing = await Configured.findOne({ where: { key: KEYS.banners } });
        if (existing) {
            // 存在则更新
            await Configured.update({ value: JSON.stringify(data) }, { where: { key: KEYS.banners } });
        } else {
            // 不存在则创建
            await Configured.create({ key: KEYS.banners, value: JSON.stringify(data) });
        }
        res.status(200).json({
            message: '修改成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
})

// 获取开屏广告配置
router.get('/splash', async (req, res) => {
    try {
        const result = await Configured.findOne({
            where: {
                key: KEYS.splash
            }
        });
        // 如果没有数据则返回空对象
        if (!result) {
            return res.status(200).json({
                message: '获取成功',
                success: true,
                data: {}
            });
        }
        res.status(200).json({
            message: '获取成功',
            success: true,
            data: JSON.parse(result.value)
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
})
// 修改开屏广告配置
router.post('/splash', async (req, res) => {
    try {
        const { data } = req.body;
        // 先尝试查找
        const existing = await Configured.findOne({ where: { key: KEYS.splash } });
        if (existing) {
            // 存在则更新
            await Configured.update({ value: JSON.stringify(data) }, { where: { key: KEYS.splash } });
        } else {
            // 不存在则创建
            await Configured.create({ key: KEYS.splash, value: JSON.stringify(data) });
        }
        res.status(200).json({
            message: '修改成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
})

// 

module.exports = router;
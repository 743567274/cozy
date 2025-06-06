const express = require('express');
const router = express.Router();
const { Brands, PhoneModel } = require('../../models');

// 查询手机品牌列表
router.get('/', async (req, res) => {
    try {
        const data_brand = await Brands.findAll();
        res.status(200).json({
            data: data_brand,
            success: true,
            message: '查询手机品牌列表成功'
        })
    } catch (error) {
        res.status(500).json({
            message: '查询手机品牌列表失败',
            error: error.message,
            success: false
        })
    }
})

// 添加手机品牌
router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: '名称不能为空',
                success: false
            });
        }
        const data_brand = await Brands.create({
            brand: name
        });
        res.status(200).json({
            success: true,
            message: '添加手机品牌成功'
        })
    } catch (error) {
        res.status(500).json({
            message: '添加手机品牌失败',
            error: error.message,
            success: false
        })
    }
})

// 修改手机品牌
router.post('/update', async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!typeof id === 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        if (!name) {
            return res.status(400).json({
                message: '名称不能为空',
            })
        }
        await Brands.update({
            brand: name
        }, {
            where: {
                id
            }
        });
        res.status(200).json({
            message: '修改手机品牌成功',
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: '修改手机品牌失败',
            error: error.message,
            success: false
        })
    }
})

//  删除手机品牌
router.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (!typeof id === 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        const data_phone = await PhoneModel.findOne({
            where: {
                brandId: id
            }
        });
        if (data_phone) {
            return res.status(400).json({
                message: '该品牌下有手机型号，请先删除手机型号',
                success: false
            });
        }
        await Brands.destroy({
            where: {
                id
            }
        });
        res.status(200).json({
            message: '删除手机品牌成功',
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: '删除手机品牌失败',
            error: error.message,
            success: false
        })
    }
})

// 查询手机型号列表
router.get('/phone', async (req, res) => {
    try {
        const { brand_id } = req.query;
        if (!typeof brand_id === 'number') {
            return res.status(400).json({
                message: '品牌id不能为空',
                success: false
            });
        }
        const data_phone = await PhoneModel.findAll({
            where: {
                brandId: brand_id
            },
            include: [
                {
                    model: Brands,
                    attributes: ['brand']
                }
            ]
        });
        res.status(200).json({
            data: data_phone,
            success: true,
            message: '查询手机型号列表成功'
        })
    } catch (error) {
        res.status(500).json({
            message: '查询手机型号列表失败',
            error: error.message,
        })
    }
})

// 添加手机型号
router.post('/phone/add', async (req, res) => {
    try {
        const { brand_id, name } = req.body;
        if (!typeof brand_id === 'number') {
            return res.status(400).json({
                message: '品牌id不能为空',
                success: false
            });
        }
        if (!name) {
            return res.status(400).json({
                message: '名称不能为空',
                success: false
            })
        }
    } catch (error) {
        res.status(500).json({
            message: '添加手机型号失败',
            error: error.message,
            success: false
        })
    }
})

// 删除手机型号
router.post('/phone/delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (!typeof id === 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        // 删除手机型号
        await PhoneModel.destroy({
            where: {
                id
            }
        });
        return res.status(200).json({
            message: '删除手机型号成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '删除手机型号失败',
            error: error.message,
            success: false
        })
    }
})

// 修改手机型号
router.post('/phone/update', async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!typeof id === 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        if (!name) {
            return res.status(400).json({
                message: '名称不能为空',
                success: false
            })
        }
        await PhoneModel.update({
            name
        }, {
            where: {
                id
            }
        });
        return res.status(200).json({
            message: '修改手机型号成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '修改手机型号失败',
            error: error.message,
            success: false
        })
    }
})
module.exports = router;
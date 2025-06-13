const express = require('express');
const router = express.Router();
const { ProductClass, Product } = require('../../models');
const { where } = require('sequelize');

// 查询商品分类
router.get('/', async (req, res) => {
    try {
        const productClasses = await ProductClass.findAll();
        res.status(200).json({
            data: productClasses,
            success: true,
            message: '获取商品分类成功'
        })
    } catch (error) {
        res.status(500).json({
            message: '获取商品分类失败',
            error: error.message,
            success: false
        });
    }
});

// 删除商品分类
router.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        // 分类下是否还有商品
        const data_product = await Product.findOne({
            where: {
                product_class: id
            }
        });
        if (data_product) {
            return res.status(400).json({
                message: '该分类下有商品，不能删除',
                success: false
            });
        }
        await ProductClass.destroy({
            where: {
                id
            }
        });
        return res.status(200).json({
            message: '删除商品分类成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '删除商品分类失败',
            error: error.message,
            success: false
        });
    }
})

// 修改商品分类名称
router.post('/update', async (req, res) => {
    try {
        const { id, name, desc } = req.body;
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        if (!name) {
            return res.status(400).json({
                message: '名称不能为空',
                success: false
            });
        }
        await ProductClass.update({
            class_name: name,
            desc
        }, {
            where: {
                id
            }
        });
        return res.status(200).json({
            message: '修改商品分类名称成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '修改商品分类名称失败',
            error: error.message,
            success: false
        });
    }
});

// 添加商品分类
router.post('/add', async (req, res) => {
    try {
        const { name, desc } = req.body;
        if (!name) {
            return res.status(400).json({
                message: '名称不能为空',
                success: false
            });
        }
        const data = await ProductClass.create({
            class_name: name,
            desc
        });
        return res.status(200).json({
            message: '添加商品分类成功',
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            message: '添加商品分类失败',
            error: error.message,
            success: false
        });
    }
});

// 查询商品列表
router.get('/product', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data_product = await Product.findAll({
            attributes: [],
            include: [
                {
                    model: ProductClass,
                    attributes: ['id', 'class_name']
                }
            ],
            offset: (page - 1) * limit,// 页数
            limit: limit
        });
        const count = await Product.count();
        res.status(200).json({
            data: data_product,
            success: true,
            total: count,
            message: '查询商品列表成功'
        })
    } catch (error) {
        res.status(500).json({
            message: '查询商品列表失败',
            error: error.message,
            success: false
        });
    }
});

// 删除商品
router.post('/product/delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        await Product.destroy({
            where: {
                id
            }
        });
        // 删除商品保留其他的限制
        // 比如：同时删除七牛云储存的文件以便于清空缓存
        return res.status(200).json({
            message: '删除商品成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '删除商品失败',
            error: error.message,
            success: false
        });
    }
})

// 新增普通商品
router.post('/product/add', async (req, res) => {
    try {
        res.status(200).json({
            message: '新增商品成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '新增商品失败',
            error: error.message,
            success: false
        });
    }
});

// 新增半定制商品
router.post('/product/add/half', async (req, res) => {
    try {
        res.status(200).json({
            message: '新增半定制商品成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '新增半定制商品失败',
            error: error.message,
            success: false
        });
    }
})

//  修改商品
router.post('/product/update', async (req, res) => {
    try {
        res.status(200).json({
            message: '修改商品成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '修改商品失败',
            error: error.message,
            success: false
        });
    }
});

module.exports = router;
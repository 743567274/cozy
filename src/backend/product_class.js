const express = require('express');
const router = express.Router();
const { ProductClass, Product } = require('../../models');
const { where } = require('sequelize');



// 辅助函数：检查循环引用
async function checkCircularReference(categoryId, potentialParentId, visited = new Set()) {
    // 如果要设置的父分类ID是null，表示设为顶级分类，不会有循环引用
    if (potentialParentId === null) return false;

    // 如果要设置的父分类ID等于当前分类ID，直接返回true
    if (categoryId === potentialParentId) return true;

    // 防止无限循环
    if (visited.has(potentialParentId)) return true;
    visited.add(potentialParentId);

    // 获取潜在父分类
    const parent = await ProductClass.findByPk(potentialParentId);
    if (!parent || parent.parent_id === null) return false;

    // 递归检查
    return await checkCircularReference(categoryId, parent.parent_id, visited);
}

// 辅助函数：获取分类层级
const levelCache = new Map();

async function getCategoryLevel(categoryId) {
    if (levelCache.has(categoryId)) {
        return levelCache.get(categoryId);
    }

    const category = await ProductClass.findByPk(categoryId);
    if (!category || !category.parent_id) {
        levelCache.set(categoryId, 1);
        return 1;
    }

    const parentLevel = await getCategoryLevel(category.parent_id);
    const level = parentLevel + 1;
    levelCache.set(categoryId, level);
    return level;
}

// 定期清空缓存
setInterval(() => levelCache.clear(), 5 * 60 * 1000); // 每5分钟清空一次

// 查询商品分类
router.get('/', async (req, res) => {
    try {
        const categories = await ProductClass.findAll({
            where: { parent_id: null },
            attributes: ['id', 'class_name', 'parent_id', 'desc'],
            order: [['parent_id', 'ASC'], ['id', 'ASC']],
            //关联
            include: [
                {
                    model: ProductClass,
                    as: 'children',
                    attributes: ['id', 'class_name', 'parent_id', 'desc'],
                    order: [['parent_id', 'ASC'], ['id', 'ASC']]
                }
            ]
        });

        res.status(200).json({
            data: categories,
            success: true,
            message: '获取所有分类成功'
        });
    } catch (error) {
        res.status(500).json({
            message: '获取所有分类失败',
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
        // 该分类下是否还有子分类
        const data_product_class = await ProductClass.findOne({
            where: {
                parent_id: id
            }
        });
        if (data_product_class) {
            return res.status(400).json({
                message: '该分类下有子分类，不能删除',
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

// 修改商品分类信息（支持父子分类）
router.post('/update', async (req, res) => {
    try {
        const { id, class_name, desc, parent_id } = req.body;

        // 验证参数
        if (!id) {
            return res.status(400).json({
                message: '分类ID不能为空',
                success: false
            });
        }
        if (!class_name) {
            return res.status(400).json({
                message: '分类名称不能为空',
                success: false
            });
        }

        // 查找要更新的分类
        const category = await ProductClass.findByPk(id);
        if (!category) {
            return res.status(404).json({
                message: '分类不存在',
                success: false
            });
        }

        // 检查是否尝试将自己设为父级
        if (parent_id === id) {
            return res.status(400).json({
                message: '不能将分类设置为自己的父级',
                success: false
            });
        }

        // 如果提供了parent_id，验证父分类是否存在
        if (parent_id !== undefined && parent_id !== null) {
            const parent = await ProductClass.findByPk(parent_id);
            if (!parent) {
                return res.status(400).json({
                    message: '指定的父分类不存在',
                    success: false
                });
            }

            // 检查循环引用
            const hasCircularRef = await checkCircularReference(id, parent_id);
            if (hasCircularRef) {
                return res.status(400).json({
                    message: '不能将分类设置为自己的子分类或孙分类',
                    success: false
                });
            }

            // 验证分类层级(假设最多3级)
            const parentLevel = await getCategoryLevel(parent_id);
            if (parentLevel >= 3) {
                return res.status(400).json({
                    message: '分类层级不能超过3级',
                    success: false
                });
            }
        }

        // 更新分类
        await category.update({
            class_name,
            desc,
            parent_id: parent_id !== undefined ? parent_id : category.parent_id
        });

        // 清空相关缓存
        levelCache.delete(id);
        if (category.parent_id !== parent_id) {
            levelCache.delete(category.parent_id);
            if (parent_id) levelCache.delete(parent_id);
        }

        res.status(200).json({
            data: category,
            success: true,
            message: '更新分类成功'
        });
    } catch (error) {
        res.status(500).json({
            message: '更新分类失败',
            error: error.message,
            success: false
        });
    }
});

// 添加商品分类（支持父子分类）
router.post('/add', async (req, res) => {
    try {
        const { class_name, desc, parent_id = null } = req.body;

        // 验证参数
        if (!class_name) {
            return res.status(400).json({
                message: '分类名称不能为空',
                success: false
            });
        }

        // 如果提供了parent_id，验证父分类是否存在
        if (parent_id) {
            const parent = await ProductClass.findByPk(parent_id);
            if (!parent) {
                return res.status(400).json({
                    message: '指定的父分类不存在',
                    success: false
                });
            }

            // 验证分类层级(假设最多3级)
            const parentLevel = await getCategoryLevel(parent_id);
            if (parentLevel >= 3) {
                return res.status(400).json({
                    message: '分类层级不能超过3级',
                    success: false
                });
            }
        }

        // 创建分类
        const category = await ProductClass.create({
            class_name,
            desc,
            parent_id
        });

        res.status(200).json({
            data: category,
            success: true,
            message: '添加分类成功'
        });
    } catch (error) {
        res.status(500).json({
            message: '添加分类失败',
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
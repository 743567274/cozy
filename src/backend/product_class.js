const express = require('express');
const router = express.Router();
const { sequelize, ProductClass, Product, User, SpecName, SpecValue, Sku, ProductCommission } = require('../../models');
const SnowflakeID = require('snowflake-id').default;
const snowflake = new SnowflakeID({ mid: 1 }); // 机器 ID 自定义
// const { sequelize } = require('../config/db');

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
        console.log('查找要更新的分类ID -> ', id);
        const category = await ProductClass.findByPk(id);
        console.log('查找要更新的分类 -> ', category);
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
        console.error(error);
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

// 查询商品列表接口
router.get('/product', async (req, res) => {
    try {
        const { page = 1, limit = 10, class_id, keyword, is_active } = req.query;

        // 类型转换
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;

        // 限制最大 limit，防止大量数据请求
        const maxLimit = 100;
        const finalLimit = Math.min(limitNum, maxLimit);
        const offset = (pageNum - 1) * finalLimit;

        // 构建查询条件
        const where = {};

        // 根据分类筛选
        if (class_id) {
            where.product_class = parseInt(class_id, 10);
        }

        // 根据关键字搜索商品名称或描述
        if (keyword) {
            where[Op.or] = [
                { product_name: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } }
            ];
        }

        // 根据启用状态筛选
        if (is_active !== undefined) {
            where.is_active = is_active === 'true' || is_active === '1';
        }

        // 使用 findAndCountAll 同时获取数据和总数，避免不一致
        const result = await Product.findAndCountAll({
            where,
            include: [
                {
                    model: ProductClass,
                    as: 'productClass',
                    attributes: ['id', 'class_name']
                },
                {
                    model: User,
                    as: 'creators',
                    attributes: ['id', 'username'] // 假设有 username 字段
                }
            ],
            attributes: [
                'id',
                'product_name',
                'type',
                'image',
                'browse',
                'top',
                'is_active',
                'created_at',
                'updated_at'
            ],
            limit: finalLimit,
            offset,
            order: [['top', 'DESC'], ['created_at', 'DESC']], // 置顶优先 + 创建时间倒序
            distinct: true // fix: 多对多关联导致 count 不准确的问题（如果将来有多个 include）
        });

        res.status(200).json({
            success: true,
            message: '查询商品列表成功',
            data: result.rows,
            total: result.count,
            page: pageNum,
            limit: finalLimit
        });
    } catch (error) {
        console.error('查询商品列表失败:', error);
        res.status(500).json({
            success: false,
            message: '查询商品列表失败',
            error: error.message
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

// 新增商品
router.post('/product/save', async (req, res) => {
    // ✅ 1. 校验请求体
    if (!req.body) {
        return res.status(400).json({
            message: '请求体不能为空',
            success: false
        });
    }

    const t = await sequelize.transaction();
    try {
        const {
            action = 'add', // add/edit
            id: productId,
            product_name,
            type,
            image = [],
            video = null,
            detail = [],
            description = '',
            creatorsId = null,
            creators_commission = 0,
            is_active = true,
            class: classIds = [],
            specs = [],
            skus = [],
            distributionLevel = 0, // 分销层级
            commission: firstLevelRate = 0, // 一级分销比例
            secondCommission = 0, // 二级分销比例
        } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: '商品ID不能为空',
                success: false
            });
        }

        // 验证商品主图是否存在
        if (!image || image.length === 0) {
            return res.status(400).json({
                message: '商品主图不能为空',
                success: false
            });
        }

        // ✅ 2. 基础参数校验
        if (!product_name || ![1, 2].includes(type)) {
            return res.status(400).json({
                message: '商品名称必填，type 必须为 1（普通）或 2（半定制）',
                success: false
            });
        }

        if (!Array.isArray(classIds) || classIds.length === 0) {
            return res.status(400).json({
                message: '分类信息不合法',
                success: false
            });
        }

        // ✅ 3. 校验创作者（如果存在）
        if (creatorsId !== null && creatorsId !== undefined) {
            const userId = Number(creatorsId);
            if (isNaN(userId)) {
                return res.status(400).json({
                    message: '创作者ID必须为数字',
                    success: false
                });
            }
            const user = await User.findByPk(userId, { transaction: t });
            if (!user) {
                return res.status(400).json({
                    message: '创作者用户不存在',
                    success: false
                });
            }
        }

        // ✅ 4. 校验商品分类
        const classes = await ProductClass.findAll({
            where: { id: classIds },
            transaction: t
        });
        if (classes.length !== classIds.length) {
            return res.status(400).json({
                message: '部分商品分类不存在',
                success: false
            });
        }

        let product;

        // ========== 新增 or 编辑商品 ==========
        if (action === 'edit') {
            product = await Product.findByPk(productId, { transaction: t, lock: t.LOCK.UPDATE });
            if (!product) {
                return res.status(404).json({
                    message: '商品不存在',
                    success: false
                });
            }

            await product.update({
                product_name,
                type,
                image,
                video,
                detail,
                description,
                creatorsId,
                creators_commission: Number(creators_commission) || 0,
                is_active: is_active ?? true,
                product_class: classIds[1]
            }, { transaction: t });

        } else {
            product = await Product.create({
                id: productId,
                product_name,
                type,
                image,
                video,
                detail,
                description,
                creatorsId,
                creators_commission: Number(creators_commission) || 0,
                is_active: is_active ?? true,
                product_class: classIds[0]
            }, { transaction: t });
        }

        // ========== 处理规格 Specs & SpecValues ==========
        const specNameMap = {}; // originalId → realSpecNameId
        const specValueMap = {}; // `${originalId}_${original_value_id}` → realValueId

        // 获取当前数据库中的规格和值
        const dbSpecs = await SpecName.findAll({
            where: { product_id: product.id },
            include: [{
                model: SpecValue,
                as: 'specValues',
                attributes: ['id', 'value', 'original_value_id']
            }],
            transaction: t
        });

        // 建立 value → specValue.id 映射（基于 original_value_id）
        const dbValueToIdMap = {};
        dbSpecs.forEach(spec => {
            spec.specValues.forEach(v => {
                dbValueToIdMap[`${spec.original_id}_${v.original_value_id}`] = v.id;
            });
        });

        for (const spec of specs) {
            const { id: originalId, name: propertyName, values = [] } = spec;

            if (!originalId || !propertyName || !Array.isArray(values)) continue;

            // 查找是否已有相同 originalId 的规格
            let dbSpec = dbSpecs.find(s => s.original_id === originalId);

            if (!dbSpec) {
                // 创建新规格，并保存 originalId
                dbSpec = await SpecName.create({
                    product_id: product.id,
                    property_name: propertyName,
                    original_id: originalId
                }, { transaction: t });

                dbSpecs.push(dbSpec);
                dbSpec.specValues = [];
            } else {
                // 更新名称（以防前端修改）
                if (dbSpec.property_name !== propertyName) {
                    await dbSpec.update({ property_name: propertyName }, { transaction: t });
                }
            }

            // 记录映射
            specNameMap[originalId] = dbSpec.id;

            // ✅ 循环保存每个值
            for (let i = 0; i < values.length; i++) {
                const valueObj = values[i];
                const value = typeof valueObj === 'string' ? valueObj : valueObj.value;
                const originalValueId = typeof valueObj === 'string' ? String(i) : valueObj.id;

                if (!value) continue;

                const dbValueKey = `${originalId}_${originalValueId}`;
                let valueId = dbValueToIdMap[dbValueKey];

                if (!valueId) {
                    const newValue = await SpecValue.create({
                        spec_name_id: dbSpec.id,
                        value,
                        original_value_id: originalValueId
                    }, { transaction: t });
                    valueId = newValue.id;
                    dbValueToIdMap[dbValueKey] = valueId;
                }

                // 映射：原始ID + 原始值ID → 真实 valueId
                specValueMap[dbValueKey] = valueId;
            }
        }

        // ========== 处理 SKU ==========
        const dbSkus = await Sku.findAll({
            where: { product_id: product.id },
            transaction: t
        });

        const dbSkuMap = {};
        dbSkus.forEach(sku => {
            dbSkuMap[sku.skuId] = sku;
        });

        for (const sku of skus) {
            const { skuId, specValueIds, specValueNames, price, originalPrice, stock, isActive } = sku;

            if (!skuId || !Array.isArray(specValueIds) || !Array.isArray(specValueNames)) {
                return res.status(400).json({
                    message: `SKU ${skuId} 数据不完整`,
                    success: false
                });
            }

            // ✅ 直接使用前端传来的 specValueIds 和 specValueNames（原始ID）
            // 不再映射为数据库自增ID！
            // 你的 Sku 表 specValueIds 字段是 JSON，直接存字符串数组即可
            const realValueIds = specValueIds; // ✅ 保留原始ID，如 ["1756391709695_0"]
            const realValueNames = specValueNames;

            if (dbSkuMap[skuId]) {
                await dbSkuMap[skuId].update({
                    specValueIds: realValueIds,
                    specValueNames: realValueNames,
                    price: Number(price) || 0,
                    originalPrice: Number(originalPrice) || 0,
                    stock: Number(stock) || 0,
                    isActive: isActive ?? true
                }, { transaction: t });
            } else {
                await Sku.create({
                    product_id: product.id,
                    skuId,
                    specValueIds: realValueIds,
                    specValueNames: realValueNames,
                    price: Number(price) || 0,
                    originalPrice: Number(originalPrice) || 0,
                    stock: Number(stock) || 0,
                    isActive: isActive ?? true
                }, { transaction: t });
            }
        }

        // ========== 清理无用数据 ==========
        const usedOriginalValueIds = new Set();

        // 收集所有被 SKU 使用的 specValueId（原始ID）
        for (const sku of skus) {
            for (const id of sku.specValueIds) {
                usedOriginalValueIds.add(id); // 如 "1756391709695_0"
            }
        }

        // 删除未被使用的 SpecValue（基于 original_value_id）
        for (const spec of dbSpecs) {
            for (const value of spec.specValues) {
                const fullId = `${spec.original_id}_${value.original_value_id}`;
                if (!usedOriginalValueIds.has(fullId)) {
                    await SpecValue.destroy({
                        where: { id: value.id },
                        transaction: t
                    });
                }
            }
        }

        // 删除没有值的 SpecName
        for (const spec of dbSpecs) {
            const count = await SpecValue.count({
                where: { spec_name_id: spec.id },
                transaction: t
            });
            if (count === 0) {
                await SpecName.destroy({
                    where: { id: spec.id },
                    transaction: t
                });
            }
        }

        // ========== 更新分佣配置 ==========
        const commissionLevel = Number(distributionLevel) || 0;
        const firstLevelRateNum = parseFloat(firstLevelRate) || 0;
        const secondCommissionAmount = Number(secondCommission) || 0;

        const commissionConfig = await ProductCommission.findOne({
            where: { product_id: product.id },
            transaction: t
        });

        if (commissionLevel >= 1) {
            if (commissionConfig) {
                await commissionConfig.update({
                    commissionLevel: commissionLevel,
                    firstLevelRate: firstLevelRateNum,
                    secondLevelRate: secondCommissionAmount,
                    isActive: true
                }, { transaction: t });
            } else {
                await ProductCommission.create({
                    product_id: product.id,
                    commissionLevel: commissionLevel,
                    firstLevelRate: firstLevelRateNum,
                    secondLevelRate: secondCommissionAmount,
                    isActive: true
                }, { transaction: t });
            }
        } else if (commissionConfig) {
            await commissionConfig.update({
                is_active: false
            }, { transaction: t });
        }

        // ✅ 提交事务
        await t.commit();

        res.status(200).json({
            message: action === 'edit' ? '编辑商品成功' : '新增商品成功',
            success: true,
            data: { productId: product.id }
        });

    } catch (error) {
        await t.rollback();
        console.error('保存商品失败:', error.stack);
        res.status(500).json({
            message: '保存商品失败',
            error: error.message,
            success: false
        });
    }
});

// 检查userid是否存在
router.post('/user/check', async (req, res) => {
    try {
        const { userid } = req.body;
        if (!userid) {
            return res.status(200).json({
                message: '用户id不能为空',
                success: false
            });
        }
        const user = await User.findByPk(userid);
        if (!user) {
            return res.status(200).json({
                message: '用户不存在',
                success: false
            })
        }
        return res.status(200).json({
            message: '用户存在',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '检查userid失败',
            error: error.message,
            success: false
        });
    }
});

// ========== 获取商品详细信息 ==========
router.get('/product/get', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: '商品id不能为空且必须为数字',
                success: false
            });
        }

        // 查商品 + 分类 + 规格 + SKU + 分佣
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: ProductClass,
                    as: 'productClass',
                    include: [
                        {
                            model: ProductClass,
                            as: 'parents'
                        }
                    ]
                },
                {
                    model: SpecName,
                    as: 'spec_name',
                    include: [
                        {
                            model: SpecValue,
                            as: 'specValues'
                        }
                    ]
                },
                {
                    model: Sku,
                    as: 'skus'
                },
                {
                    model: ProductCommission,
                    as: 'commissionConfig'
                }
            ]
        });

        if (!product) {
            return res.status(404).json({
                message: '商品不存在',
                success: false
            });
        }

        // ===== 分类处理 =====
        let classIds = [];
        if (product.productClass) {
            if (product.productClass.parent_id) {
                classIds = [product.productClass.parent_id, product.productClass.id];
            } else {
                classIds = [product.productClass.id];
            }
        }

        // ===== 规格处理 =====
        // 聚合同一个规格下的所有值
        const specMap = {};
        product.spec_name.forEach(spec => {
            if (!specMap[spec.original_id]) {
                specMap[spec.original_id] = {
                    id: spec.original_id,
                    name: spec.property_name,
                    values: []
                };
            }
            spec.specValues.forEach(v => {
                if (!specMap[spec.original_id].values.includes(v.value)) {
                    specMap[spec.original_id].values.push(v.value);
                }
            });
        });
        const specs = Object.values(specMap);

        // ===== SKU =====
        const skus = product.skus.map(sku => ({
            skuId: sku.skuId,
            specValueIds: sku.specValueIds,
            specValueNames: sku.specValueNames,
            price: Number(sku.price),
            originalPrice: Number(sku.originalPrice),
            stock: Number(sku.stock),
            isActive: sku.isActive
        }));

        // ===== 分佣 =====
        const commissionConfig = product.commissionConfig || {};
        const distributionLevel = commissionConfig.commissionLevel || 0;

        const result = {
            action: 'edit',
            id: product.id,
            type: product.type,
            class: classIds,
            skus,
            image: product.image,
            video: product.video,
            detail_image: product.detail || [],
            is_active: product.is_active,
            distributionLevel,
            distributionLevel: commissionConfig.commissionLevel || 0,
            commission: commissionConfig.firstLevelRate || 0,
            secondCommission: commissionConfig.secondLevelRate || 0,
            specs,
            product_name: product.product_name,
            description: product.description,
            creatorsId: product.creators_id || null,
            creators_commission: product.creators_commission || 0
        };

        res.status(200).json({
            message: '获取商品详情成功',
            success: true,
            data: result
        });

    } catch (error) {
        console.error('获取商品详情失败:', error);
        res.status(500).json({
            message: '获取商品详情失败',
            error: error.message,
            success: false
        });
    }
});

// 申请一个商品ID
router.get('/product/apply', async (req, res) => {
    try {
        const product_id = '' + snowflake.generate();
        res.status(200).json({
            data: product_id,
            success: true,
            message: '申请商品ID成功'
        });
    } catch (error) {
        res.status(500).json({
            message: '申请商品ID失败',
        })
    }
})

module.exports = router;
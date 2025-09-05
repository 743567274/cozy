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
            distributionLevel = 0,
            commission: firstLevelRate = 0,
            secondCommission = 0
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
        const specNameMap = {}; // tempSpecId → realSpecNameId
        const specValueMap = {}; // `${tempSpecId}_${value}` → realValueId

        // 获取当前数据库中的规格和值
        const dbSpecs = await SpecName.findAll({
            where: { product_id: product.id },
            include: [{
                model: SpecValue,
                as: 'specValues',
                attributes: ['id', 'value']
            }],
            transaction: t
        });

        // 建立 value → specValue.id 映射
        const dbValueToIdMap = {};
        dbSpecs.forEach(spec => {
            spec.specValues.forEach(v => {
                dbValueToIdMap[`${spec.id}_${v.value}`] = v.id;
            });
        });

        for (const spec of specs) {
            const { id: tempSpecId, name: propertyName, values = [] } = spec;

            if (!propertyName || !Array.isArray(values)) continue;

            // 查找是否已有同名规格（避免重复创建）
            let dbSpec = dbSpecs.find(s => s.property_name === propertyName);

            if (!dbSpec) {
                // 创建新规格
                dbSpec = await SpecName.create({
                    product_id: product.id,
                    property_name: propertyName
                }, { transaction: t });

                // 添加到 dbSpecs 以便后续查找
                dbSpecs.push(dbSpec);
                dbSpec.specValues = [];
            }

            // 记录映射
            specNameMap[tempSpecId] = dbSpec.id;

            for (const value of values) {
                if (!value) continue;

                const dbValueKey = `${dbSpec.id}_${value}`;
                let valueId = dbValueToIdMap[dbValueKey];

                if (!valueId) {
                    // 创建新值
                    const newValue = await SpecValue.create({
                        spec_name_id: dbSpec.id,
                        value
                    }, { transaction: t });
                    valueId = newValue.id;
                    dbValueToIdMap[dbValueKey] = valueId;
                }

                // 映射：临时规格ID + 值 → 真实 valueId
                specValueMap[`${tempSpecId}_${value}`] = valueId;
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

            // 映射临时 valueId 到真实 valueId
            const realValueIds = [];
            for (let i = 0; i < specValueNames.length; i++) {
                const tempSpecId = specValueIds[i]?.split('_')?.[0]; // 提取临时规格ID
                if (!tempSpecId) continue;

                const key = `${tempSpecId}_${specValueNames[i]}`;
                const realId = specValueMap[key];
                if (realId) realValueIds.push(realId);
            }

            if (realValueIds.length === 0) {
                return res.status(400).json({
                    message: `SKU ${skuId} 规格值映射失败`,
                    success: false
                });
            }

            if (dbSkuMap[skuId]) {
                await dbSkuMap[skuId].update({
                    specValueIds: realValueIds,
                    specValueNames,
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
                    specValueNames,
                    price: Number(price) || 0,
                    originalPrice: Number(originalPrice) || 0,
                    stock: Number(stock) || 0,
                    isActive: isActive ?? true
                }, { transaction: t });
            }
        }

        // ========== 清理无用数据 ==========
        const usedValueIds = new Set();

        // 收集所有被 SKU 使用的 specValueId
        for (const sku of skus) {
            for (let i = 0; i < sku.specValueNames.length; i++) {
                const tempSpecId = sku.specValueIds[i]?.split('_')?.[0];
                if (!tempSpecId) continue;
                const key = `${tempSpecId}_${sku.specValueNames[i]}`;
                const realId = specValueMap[key];
                if (realId) usedValueIds.add(realId);
            }
        }

        // 删除未被使用的 SpecValue
        const allDbValueIds = new Set(Object.values(dbValueToIdMap));
        for (const valueId of allDbValueIds) {
            if (!usedValueIds.has(valueId)) {
                await SpecValue.destroy({
                    where: { id: valueId },
                    transaction: t
                });
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
                    commission_level: commissionLevel,
                    first_level_rate: firstLevelRateNum,
                    second_commission: secondCommissionAmount,
                    is_active: true
                }, { transaction: t });
            } else {
                await ProductCommission.create({
                    product_id: product.id,
                    commission_level: commissionLevel,
                    first_level_rate: firstLevelRateNum,
                    second_commission: secondCommissionAmount,
                    is_active: true
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
            message: productId ? '编辑商品成功' : '新增商品成功',
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
        if (!id) {
            return res.status(400).json({
                message: '商品id不能为空',
                success: false
            });
        }

        const productId = Number(id);
        if (isNaN(productId)) {
            return res.status(400).json({
                message: '商品id必须为数字',
                success: false
            });
        }

        // 1. 查询商品主信息
        const product = await Product.findByPk(productId, {
            include: [
                {
                    model: SpecName,           // ✅ 正确模型名
                    as: 'spec_name',           // ✅ 必须和 Product.associate 中定义的 as 一致
                    order: [['id', 'ASC']],
                    include: [
                        {
                            model: SpecValue,
                            as: 'specValues',      // ✅ 这个是对的（SpecName.hasMany 中定义的）
                            order: [['id', 'ASC']]
                        }
                    ]
                },
                {
                    model: Sku,
                    as: 'skus'                 // ✅ 正确
                },
                {
                    model: ProductCommission,
                    as: 'commissionConfig'     // ✅ 正确
                }
            ]
            // ✅ 注意：整个 include 的 order 不要再写在顶层 include 数组里
        });

        if (!product) {
            return res.status(404).json({
                message: '商品不存在',
                success: false
            });
        }

        // 2. 获取分类路径
        let classIds = [];
        const childClassId = product.product_class;

        if (childClassId) {
            const childClass = await ProductClass.findByPk(childClassId);
            if (childClass) {
                classIds.push(childClass.id);
                if (childClass.parent_id) {
                    classIds.unshift(childClass.parent_id);
                }
            }
        }

        // 3. 构建规格数据（保持不变）
        const formattedSpecs = product.spec_name.map(spec => ({
            id: spec.id,
            name: spec.name,
            values: spec.specValues.map(v => v.value)
        }));

        // ✅ 4. 构建 SKU 数据：增强版，包含 specCombination
        // 创建：specValueId -> { value, specName }
        const valueToSpecMap = {};
        product.spec_name.forEach(spec => {
            spec.specValues.forEach(v => {
                valueToSpecMap[v.id] = {
                    value: v.value,
                    specName: spec.name
                };
            });
        });

        const formattedSkus = product.skus.map(sku => {
            // 根据 specValueIds，还原出 { 规格名: 规格值 } 的对象
            const specValueNames = [];

            sku.specValueIds.forEach(valueId => {
                const mapping = valueToSpecMap[valueId];
                if (mapping) {
                    specValueNames.push(mapping.value);
                }
            });

            return {
                skuId: sku.skuId,
                specValueIds: sku.specValueIds.map(id => String(id)), // 保持字符串数组
                specValueNames, // 纯值数组，用于表格展示
                price: sku.price,
                originalPrice: sku.originalPrice,
                stock: sku.stock,
                isActive: sku.isActive
            };
        });

        // 5. 构建响应数据
        const result = {
            id: product.id,
            product_name: product.product_name,
            type: product.type,
            class: classIds,
            specs: formattedSpecs,
            skus: formattedSkus, // ✅ 包含 specCombination
            image: product.image || [],
            detail: product.detail || [],
            video: product.video || null,
            description: product.description || '',
            creatorsId: product.creatorsId || null,
            creators_commission: product.creators_commission || 0,
            is_active: product.is_active,
            distributionLevel: product.commissionConfig?.commissionLevel ?? 0,
            commission: product.commissionConfig?.firstLevelRate ?? 0,
            secondCommission: product.commissionConfig?.secondCommission ?? 0
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
        const product_id = snowflake.generate();
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
const express = require('express');
const router = express.Router();
const { sequelize, PhoneModelType, PhoneModelSpec, PhoneModelAssociated, PhoneModel, Brands } = require('../../models')

// 增加手机壳类型
router.post('/phone_case/add', async (req, res) => {
    try {
        const { type_name, image, status = true, price } = req.body;
        if (!type_name || !image) {
            return res.status(400).json({
                message: '名称或图片不能为空',
                success: false
            });
        }
        await PhoneModelType.create({
            type_name: type_name,
            image: image,
            status,
            price
        });
        res.status(200).json({
            message: '添加手机壳类型成功',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: '添加手机壳类型失败',
            error: err.message,
            success: false
        });
    }
});

// 删除手机壳类型
router.post('/phone_case/delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        await PhoneModelType.destroy({
            where: {
                id
            }
        });
        res.status(200).json({
            message: '删除手机壳类型成功',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: '删除手机壳类型失败',
            error: err.message,
            success: false
        })
    }
})

// 修改手机壳类型
router.post('/phone_case/update', async (req, res) => {
    try {
        const { id } = req.body;
        if (!typeof id === 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        const { type_name, image, status = true, price } = req.body;
        if (!type_name || !image) {
            return res.status(400).json({
                message: '名称或图片不能为空',
                success: false
            });
        }
        await PhoneModelType.update({
            type_name: type_name,
            image: image,
            price,
            status
        }, {
            where: {
                id
            }
        });
        res.status(200).json({
            message: '修改手机壳类型成功',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: '修改手机壳类型失败',
            error: err.message,
            success: false
        })
    }
})

// 获取手机壳类型列表
router.get('/phone_case/list', async (req, res) => {
    try {
        const data_phone_case = await PhoneModelType.findAll({
            attributes: ['id', 'type_name', 'image', 'status', 'price']
        });
        return res.status(200).json({
            message: '获取手机壳类型列表成功',
            data: data_phone_case,
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: '获取手机壳类型列表失败',
            error: err.message,
            success: false
        })
    }
})

// 增加手机壳规格
router.post('/phone_case/spec/add', async (req, res) => {
    try {
        const { spec_name, status = true } = req.body;
        if (!spec_name) {
            return res.status(400).json({
                message: '规格名称不能为空',
                success: false
            });
        }
        await PhoneModelSpec.create({
            spec_name,
            status
        });
        res.status(200).json({
            message: '添加手机壳规格成功',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: '添加手机壳规格失败',
            error: err.message,
            success: false
        })
    }
})

//  删除手机壳规格
router.post('/phone_case/spec/delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        await PhoneModelSpec.destroy({
            where: {
                id
            }
        });
        res.status(200).json({
            message: '删除手机壳规格成功',
        })
    } catch (err) {
        res.status(500).json({
            message: '删除手机壳规格失败',
            error: err.message,
            success: false
        })
    }
})

//  修改手机壳规格
router.post('/phone_case/spec/update', async (req, res) => {
    try {
        const { id } = req.body;
        if (!typeof id === 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        const { spec_name, status = true } = req.body;
        if (!spec_name) {
            return res.status(400).json({
                message: '规格名称不能为空',
            })
        }
        await PhoneModelSpec.update({
            spec_name,
            status
        }, {
            where: {
                id
            }
        });
        res.status(200).json({
            message: '修改手机壳规格成功',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: '修改手机壳规格失败',
            error: err.message,
            success: false
        })
    }
})

// 获取手机壳规格列表
router.get('/phone_case/spec/list', async (req, res) => {
    try {
        const { id } = req.query;

        if (id) {
            // 直接通过PhoneModelSpec查询与指定类型关联的规格
            const specs = await PhoneModelSpec.findAll({
                include: [{
                    model: PhoneModelAssociated,
                    as: 'associatedModels',
                    where: { phone_typeId: id },
                    attributes: []
                }],
                attributes: ['id', 'spec_name', 'status'],
                group: ['PhoneModelSpec.id'],  // 按ID分组
                raw: true
            });

            return res.status(200).json({
                message: '获取手机壳规格列表成功',
                data: specs,
                success: true
            });
        } else {
            // 查询所有类型及其规格（分步查询避免内存问题）
            const types = await PhoneModelType.findAll({
                where: { status: true },
                attributes: ['id', 'type_name', 'image', 'status'],
                raw: true
            });

            // 为每个类型查询关联的规格
            const result = await Promise.all(types.map(async type => {
                const specs = await PhoneModelSpec.findAll({
                    include: [{
                        model: PhoneModelAssociated,
                        as: 'associatedModels',
                        where: { phone_typeId: type.id },
                        attributes: []
                    }],
                    attributes: ['id', 'spec_name', 'status'],
                    group: ['PhoneModelSpec.id'],
                    raw: true
                });

                return {
                    ...type,
                    phoneModelSpecs: specs
                };
            }));

            return res.status(200).json({
                message: '获取所有手机壳类型及其规格成功',
                data: result,
                success: true
            });
        }
    } catch (err) {
        console.error('获取手机壳规格列表失败:', err);
        res.status(500).json({
            message: '获取手机壳规格列表失败',
            error: err.message,
            success: false
        });
    }
});

// 添加手机壳关联
router.post('/phone_case/associated/add', async (req, res) => {
    const transaction = await sequelize.transaction(); // 创建事务

    try {
        const { phoneBrand, phoneTypeId, phoneModelSpecId, brand: modelName, image } = req.body;

        // 参数校验
        if (!Number.isInteger(phoneTypeId) || !Number.isInteger(phoneModelSpecId)) {
            await transaction.rollback(); // 出现错误时回滚事务
            return res.status(400).json({
                message: '手机壳类型id、手机壳规格id必须为整数',
                success: false
            });
        }
        if (!image || !modelName) {
            await transaction.rollback();
            return res.status(400).json({
                message: '图片和型号名称不能为空',
                success: false
            });
        }

        let brandId;

        // Step 1: 处理品牌（Brands 表）
        if (typeof phoneBrand === 'string') {
            const [brand] = await Brands.findOrCreate({
                where: { brand: phoneBrand },
                defaults: { brand: phoneBrand },
                transaction
            });
            brandId = brand.id;
        } else if (typeof phoneBrand === 'number') {
            const existingBrand = await Brands.findByPk(phoneBrand, { transaction });
            if (!existingBrand) {
                await transaction.rollback();
                return res.status(400).json({
                    message: '指定的品牌 ID 不存在',
                    success: false
                });
            }
            brandId = phoneBrand;
        } else {
            await transaction.rollback();
            return res.status(400).json({
                message: 'phoneBrand 必须是品牌 ID（数字）或品牌名称（字符串）',
                success: false
            });
        }

        // Step 2: 更新或创建 phone_models 表中的记录
        const [phoneModel, created] = await PhoneModel.findOrCreate({
            where: { model: modelName, brandId },
            defaults: { model: modelName, brandId },
            transaction
        });

        // Step 3: 创建 phone_model_associated 表中的记录
        const newRecord = await PhoneModelAssociated.create({
            phone_modelId: phoneModel.id,
            phone_typeId,
            phone_model_specId,
            image
        }, { transaction });

        console.log('新记录已创建:', JSON.stringify(newRecord, null, 2));

        await transaction.commit(); // 提交事务

        res.status(200).json({
            message: '添加手机壳关联成功',
            success: true
        });
    } catch (err) {
        await transaction.rollback(); // 出现错误时回滚事务
        console.error('添加手机壳关联失败:', err);
        res.status(500).json({
            message: '添加手机壳关联失败',
            error: err.message,
            success: false
        });
    }
});

//  删除手机壳关联
router.post('/phone_case/associated/delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        await PhoneModelAssociated.destroy({
            where: {
                id
            }
        });
        res.status(200).json({
            message: '删除手机壳关联成功',
        })
    } catch (err) {
        res.status(500).json({
            message: '删除手机壳关联失败',
            error: err.message,
            success: false
        })
    }
})


// 修改手机壳关联（支持品牌自动创建）
router.post('/phone_case/associated/update', async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id, phoneBrand, phoneTypeId, phoneModelSpecId, image, modelId, brand: modelName } = req.body;

        // 参数校验
        if (![id, phoneTypeId, phoneModelSpecId, modelId].every(x => typeof x === 'number')) {
            return res.status(400).json({
                message: 'id、phoneTypeId、phoneModelSpecId、modelId 必须为数字',
                success: false
            });
        }
        if (!image || !modelName) {
            return res.status(400).json({
                message: 'image 和 型号名称（brand）不能为空',
                success: false
            });
        }

        let brandId;

        // Step 1: 处理品牌（Brands 表）
        if (typeof phoneBrand === 'string') {
            const [brand] = await Brands.findOrCreate({
                where: { brand: phoneBrand },
                defaults: { brand: phoneBrand },
                transaction
            });
            brandId = brand.id;
        } else if (typeof phoneBrand === 'number') {
            const existingBrand = await Brands.findByPk(phoneBrand, { transaction });
            if (!existingBrand) {
                return res.status(400).json({
                    message: '指定的品牌 ID 不存在',
                    success: false
                });
            }
            brandId = phoneBrand;
        } else {
            return res.status(400).json({
                message: 'phoneBrand 必须是品牌 ID（数字）或品牌名称（字符串）',
                success: false
            });
        }

        // Step 2: 更新 phone_models 表（根据 modelId）
        const phoneModel = await PhoneModel.findByPk(modelId, { transaction });
        if (!phoneModel) {
            return res.status(404).json({
                message: `手机型号（ID: ${modelId}）不存在`,
                success: false
            });
        }

        let shouldUpdateModel = false;
        if (phoneModel.brandId !== brandId) {
            phoneModel.brandId = brandId;
            shouldUpdateModel = true;
        }
        if (phoneModel.model !== modelName) {
            phoneModel.model = modelName;
            shouldUpdateModel = true;
        }

        if (shouldUpdateModel) {
            await phoneModel.save({ transaction });
        }

        // Debug: 输出即将执行的更新信息
        console.log(`准备更新 phone_model_associated 表，ID=${id}, phone_modelId=${modelId}, phone_typeId=${phoneTypeId}, phone_model_specId=${phoneModelSpecId}, image=${image}`);

        const record = await PhoneModelAssociated.findByPk(id, { transaction });
        if (!record) {
            await transaction.rollback();
            return res.status(404).json({
                message: `未找到 phone_model_associated 记录（ID: ${id}）`,
                success: false
            });
        }
        console.log('查到的记录:', JSON.stringify(record, null, 2));

        // 检查是否有变化
        const hasChanges =
            record.phone_modelId !== modelId ||
            record.phone_typeId !== phoneTypeId ||
            record.phone_model_specId !== phoneModelSpecId ||
            record.image !== image;

        if (hasChanges) {
            // Step 3: 更新 phone_model_associated 表
            const [updated] = await PhoneModelAssociated.update(
                {
                    phone_modelId: modelId,
                    phone_typeId: phoneTypeId,
                    phone_model_specId: phoneModelSpecId,
                    image
                },
                {
                    where: { id },
                    transaction
                }
            );
            console.log(`更新影响行数: ${updated}`);
        } else {
            console.log('记录已存在且数据未变化，无需更新');
        }

        await transaction.commit();
        res.status(200).json({
            message: '修改手机壳关联成功',
            success: true
        });
    } catch (err) {
        await transaction.rollback();
        console.error('修改手机壳关联失败:', err);
        res.status(500).json({
            message: '修改手机壳关联失败',
            error: err.message,
            success: false
        });
    }
});

// 获取手机壳类型关联的型号列表
router.get('/phone/case/phone', async (req, res) => {
    try {
        // phone_typeid 手机壳类型id
        // phone_specid 手机规格id
        const { phone_typeid, phone_specid, page = 1 } = req.query;
        if (!phone_typeid || !phone_specid) {
            return res.status(400).json({
                message: 'ID不能为空',
                success: false
            });
        }
        const pageSize = 10; // 每页数量

        const { rows, count } = await PhoneModelAssociated.findAndCountAll({
            where: {
                phone_typeId: phone_typeid,
                phone_model_specId: phone_specid
            },
            include: [
                {
                    model: PhoneModel,
                    as: 'phoneModel',
                    include: [{
                        model: Brands,
                        as: 'brands',
                        attributes: ['id', 'brand']
                    }],

                },
                {
                    model: PhoneModelType,
                    as: 'phoneType',
                    attributes: ['type_name', 'image', 'price'] // 返回手机壳类型名称、图片和价格
                }
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        });

        // 构建返回数据结构
        const dataWithDetails = rows.map(row => ({
            id: row.id,
            image: row.image, // 手机壳的模型图
            brand: row.phoneModel.brands.brand, // 手机品牌
            brandId: row.phoneModel.brands.id, // 手机品牌ID
            phoneModel: row.phoneModel.model, // 手机型号
            phoneModelId: row.phoneModel.id, // 手机型号ID
            caseType: row.phoneType.type_name, // 手机壳类型名称
            caseImage: row.phoneType.image, // 手机壳类型图片
            price: row.phoneType.price // 手机壳价格
        }));

        res.status(200).json({
            data: dataWithDetails,
            success: true,
            total: count,
            limit: pageSize,
            message: '查询手机型号成功'
        });
    } catch (err) {
        res.status(500).json({
            message: '获取手机壳类型关联的型号失败',
            error: err.message,
            success: false
        });
    }
});

// 获取所有手机品牌列表
router.get('/phone/brands', async (req, res) => {
    try {
        // 从Brands模型中查找所有记录
        const brands = await Brands.findAll({
            attributes: ['id', 'brand'] // 只需要品牌的ID和名称
        });

        // 返回成功响应
        res.status(200).json({
            data: brands,
            success: true,
            message: '获取手机品牌列表成功'
        });
    } catch (err) {
        // 捕获并处理错误
        res.status(500).json({
            message: '获取手机品牌列表失败',
            error: err.message,
            success: false
        });
    }
});

module.exports = router;
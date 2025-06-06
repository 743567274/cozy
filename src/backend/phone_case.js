const express = require('express');
const router = express.Router();
const { PhoneModelType, PhoneModelSpec, PhoneModelAssociated } = require('../../models')

// 增加手机壳类型
router.post('/phone_case/add', async (req, res) => {
    try {
        const { name, img, status = true } = req.body;
        if (!name || !img) {
            return res.status(400).json({
                message: '名称或图片不能为空',
                success: false
            });
        }
        await PhoneModelType.create({
            type_name: name,
            image: img,
            status
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
        const { name, img, status = true } = req.body;
        if (!name || !img) {
            return res.status(400).json({
                message: '名称或图片不能为空',
                success: false
            });
        }
        await PhoneModelType.update({
            type_name: name,
            image: img,
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
            attributes: ['id', 'type_name', 'image', 'status', 'createdAt', 'updatedAt']
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
        const data_phone_case_spec = await PhoneModelSpec.findAll({
            attributes: ['id', 'spec_name', 'status']
        });
        return res.status(200).json({
            message: '获取手机壳规格列表成功',
            data: data_phone_case_spec,
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: '获取手机壳规格列表失败',
            error: err.message,
            success: false
        })
    }
})

// 添加手机壳关联
router.post('/phone_case/associated/add', async (req, res) => {
    try {
        const { phone_modelId, phone_typeId, phone_model_specId, image } = req.body;
        if (!typeof phone_modelId === 'number' || !typeof phone_typeId === 'number' || !typeof phone_model_specId === 'number') {
            return res.status(400).json({
                message: '手机型号id、手机壳类型id、手机壳规格id不能为空',
                success: false
            });
        }
        if (!image) {
            return res.status(400).json({
                message: '图片不能为空',
                success: false
            });
        }
        await PhoneModelAssociated.create({
            phone_modelId,
            phone_typeId,
            phone_model_specId,
            image
        });
        res.status(200).json({
            message: '添加手机壳关联成功',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: '添加手机壳关联失败',
            error: err.message,
            success: false
        })
    }
})

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

// 修改手机壳关联
router.post('/phone_case/associated/update', async (req, res) => {
    try {
        const { id, phone_modelId, phone_typeId, phone_model_specId, image } = req.body;
        if (!typeof id === 'number' || !typeof phone_modelId === 'number' || !typeof phone_typeId === 'number' || !typeof phone_model_specId === 'number') {
            return res.status(400).json({
                message: '手机型号id、手机壳类型id、手机壳规格id不能为空',
                success: false
            });
        }
        if (!image) {
            return res.status(400).json({
                message: '图片不能为空',
                success: false
            });
        }
        await PhoneModelAssociated.update({
            phone_modelId,
            phone_typeId,
            phone_model_specId,
            image
        }, {
            where: {
                id
            }
        });
        res.status(200).json({
            message: '修改手机壳关联成功',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: '修改手机壳关联失败',
            error: err.message,
            success: false
        })
    }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const { administrator } = require('../../models');

// 获取管理员账户
router.get('/', async (req, res) => {
    try {
        const data_administrator = await administrator.findAll({
            attributes: ['id', 'username', 'password', 'owner', 'createdAt', 'updatedAt'],
        });
        return res.status(200).json({
            message: '获取管理员账户成功',
            data: data_administrator,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '获取管理员账户失败',
            error: error.message,
            success: false
        });
    }
});

// 创建管理员账户
router.post('/add', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({
                message: '用户名或密码不能为空',
                success: false
            });
        }
        const data_administrator = await administrator.create({
            username,
            password,
            owner: false
        });
        return res.status(201).json({
            message: '创建管理员账户成功',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '创建管理员账户失败',
            error: error.message,
            success: false
        });
    }
})

// 删除管理员账户
router.post('/delete', async (req, res) => {
    const { id } = req.body;
    try {
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: '管理员账户id不能为空',
                success: false
            });
        }
        const data_administrator = await administrator.findOne({
            where: {
                id
            }
        });
        if (!data_administrator) {
            return res.status(400).json({
                message: '管理员账户不存在',
                success: false
            });
        }
        if (data_administrator.owner) {
            return res.status(400).json({
                message: '不能删除主管理员账户',
                success: false
            });
        }
        await data_administrator.destroy();
        return res.status(200).json({
            message: '删除管理员账户成功',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '删除管理员账户失败',
            error: error.message,
            success: false
        });
    }
})

// 修改管理员账户
router.post('/update', async (req, res) => {
    const { id, username, password } = req.body;
    try {
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: '管理员账户id不能为空',
                success: false
            });
        }
        if (!username && !password) {
            return res.status(400).json({
                message: '用户名或密码不能为空',
                success: false
            });
        }
        const data_administrator = await administrator.findOne({
            where: {
                id
            }
        });
        if (!data_administrator) {
            return res.status(400).json({
                message: '管理员账户不存在',
                success: false
            });
        }
        await data_administrator.update({
            username,
            password
        });
        return res.status(200).json({
            message: '修改管理员账户成功',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '修改管理员账户失败',
            error: error.message,
            success: false
        });
    }
})
module.exports = router;

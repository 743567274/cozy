const express = require('express');
const router = express.Router();
const { User } = require('../../models');

// 查询用户列表
router.get('/', async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const users = await User.findAll({
            attributes: ['id', 'name', 'avatar', 'last_login', 'visit_count', 'superiorId', 'balance', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: User,
                    as: 'superior',
                    attributes: ['id', 'name', 'avatar',]
                }
            ],
            offset: (page - 1) * pageSize,// 页数
            limit: pageSize // 每页数量
        });
        const total = await User.count();
        res.status(200).json({
            message: '获取用户列表成功',
            data: users,
            total: total,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '获取用户列表失败',
            error: error.message,
            success: false
        });
    }
});



module.exports = router;
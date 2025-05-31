const express = require('express');
const router = express.Router();
const { Withdrawal } = require('../../models');

// 获取提现列表
router.get('/', async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const withdrawals = await Withdrawal.findAll({
            attributes: ['id', 'userId', 'amount', 'status', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'avatar',]
                }
            ],
            offset: (page - 1) * pageSize,// 页数
            limit: pageSize
        })
        const total = await Withdrawal.count();
        res.status(200).json({
            message: '获取提现列表成功',
            data: withdrawals,
            total,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '获取提现列表失败',
            error: error.message,
            success: false
        });
    }
});

// 提现申请修改
router.post('/update', async (req, res) => {
    try {
        const { id, status, reason } = req.body;
        if (!typeof id === 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        if (!typeof id === 'number') {
            return res.status(400).json({
                message: '状态不能为空',
                success: false
            })
        }
        const Withdrawals = await Withdrawal.findOne({
            where: {
                id
            }
        });
        if (!Withdrawals) {
            return res.status(400).json({
                message: '该提现申请不存在',
                success: false
            });
        }
        Withdrawals.status = status;
        if (reason) {
            Withdrawals.reason = reason;
        }
        await Withdrawals.save();
        return res.status(200).json({
            message: '操作成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '拒绝提现失败',
            error: error.message,
            success: false
        });
    }
}
)


module.exports = router;
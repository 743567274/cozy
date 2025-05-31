const express = require('express');
const router = express.Router();
const { Order } = require('../../models');

// 查询订单列表
router.get('/order', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data_order = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ],
            offset: (page - 1) * limit,// 页数
            limit: limit
        });
        const count = await Order.count();
        res.status(200).json({
            data: data_order,
            success: true,
            total: count,
            message: '查询订单列表成功'
        })
    } catch (error) {
        res.status(500).json({
            message: '查询订单列表失败',
            error: error.message,
            success: false
        });
    }
})

// 订单发货
router.post('/order/delivery', async (req, res) => {
    try {
        const { id, express_name, express_number } = req.body;
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        if (!express_name || !express_number) {
            return res.status(400).json({
                message: '快递名称和快递单号不能为空',
                success: false
            });
        }
        const data_order = await Order.findOne({ where: { id } });
        if (!data_order) {
            return res.status(400).json({
                message: '该订单不存在',
                success: false
            });
        }
        if (data_order.status !== 1) {
            return res.status(400).json({
                message: '该订单不能发货',
                success: false
            });
        }
        data_order.express_name = express_name; // 快递名称
        data_order.express_number = express_number; // 快递单号
        data_order.status = 2; //  更改订单为已发货

        closing_time = new Date();
        data_order.delivery_time = closing_time; // 发货时间

        closing_time.setDate(closing_time.getDate() + 7);
        data_order.closing_time = closing_time; // 订单关闭时间
        await data_order.save();
        res.status(200).json({
            message: '订单发货成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '订单发货失败',
            error: error.message,
            success: false
        });
    }
})

// 修改快递单号和公司
router.post('/order/express_number', async (req, res) => {
    try {
        const { id, express_name, express_number } = req.body;
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        if (!express_name || !express_number) {
            return res.status(400).json({
                message: '快递名称和快递单号不能为空',
                success: false
            });
        }
        const data_order = await Order.findOne({ where: { id } });
        if (!data_order) {
            return res.status(400).json({
                message: '该订单不存在',
                success: false
            });
        }
        data_order.express_name = express_name;
        data_order.express_number = express_number;
        await data_order.save();
        res.status(200).json({
            message: '修改快递单号成功',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: '修改快递单号失败',
            error: error.message,
            success: false
        });
    }
})

// 修改订单备注
router.post('/order/remark', async (req, res) => {
    try {
        const { id, remark } = req.body;
        if (typeof id !== 'number') {
            return res.status(400).json({
                message: 'id不能为空',
                success: false
            });
        }
        if (!remark) {
            return res.status(400).json({
                message: '备注不能为空',
                success: false
            });
        }
        const order = await Order.findOne({
            where: {
                id
            }
        });
        if (!order) {
            return res.status(400).json({
                message: '订单不存在',
                success: false
            });
        }
        order.remark = remark;
        await order.save();
        return res.status(200).json({
            message: '备注修改成功',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: '服务器错误',
            error: error.message,
            success: false
        });
    }
})
module.exports = router;
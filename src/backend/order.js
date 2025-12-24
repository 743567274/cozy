const express = require('express');
const router = express.Router();
const { Order, User, Address, OrderProduct, Product, Sku } = require('../../models');

// 查询订单列表
// routes/order.js 或你的路由文件中

const { Op } = require('sequelize'); // 用于条件查询


// 查询订单列表
router.get('/order', async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        // 参数校验与转换
        const pageNum = Math.max(1, parseInt(page, 10)) || 1;
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10))) || 10;

        // 构建查询条件
        const where = {};
        if (status !== undefined) {
            const statusNum = parseInt(status, 10);
            if (!isNaN(statusNum) && statusNum >= 0 && statusNum <= 7) {
                where.status = statusNum;
            }
        }

        // 查询订单 + 用户 + 地址 + 订单商品 + 商品信息
        const { rows: orders, count: total } = await Order.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'username', 'avatar'],
                    required: false
                },
                {
                    model: Address,
                    as: 'address',
                    required: true
                },
                {
                    model: OrderProduct,
                    as: 'orderProducts',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'product_name', 'image']
                        },
                        {
                            model: Sku,
                            as: 'sku'
                        }
                    ]
                }
            ],
            attributes: {
                exclude: ['password', 'remarks', 'user_id', 'shipping_address'] // 排除敏感或冗余字段
            },
            offset: (pageNum - 1) * limitNum,
            limit: limitNum,
            order: [['created_at', 'DESC']],
            distinct: true // 防止因 include 导致 count 重复
        });

        // 成功响应
        res.status(200).json({
            success: true,
            message: '查询订单列表成功',
            data: orders,
            current: pageNum,
            pageSize: limitNum,
            total: total,
            totalPages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        console.error('[Order List Error]:', error.message, error.stack);
        res.status(500).json({
            success: false,
            message: '查询订单列表失败，请稍后重试',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 查询订单详情
router.get('/order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data_order = await Order.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name'],
                    required: false
                },
                {
                    model: Address,
                    as: 'address',
                    required: true
                },
                {
                    model: OrderProduct,
                    as: 'orderProducts',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'product_name', 'image']
                        },
                        {
                            model: Sku,
                            as: 'sku'
                        }
                    ]
                }
            ]
        })
        if (!data_order) {
            return res.status(400).json({
                message: '该订单不存在',
                success: false
            });
        }
        return res.status(200).json({
            success: true,
            message: '查询订单详情成功',
            data: data_order
        });
    } catch (error) {
        console.error('[Order List Error]:', error.message, error.stack);
        res.status(500).json({
            success: false,
            message: '查询订单列表失败，请稍后重试',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

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
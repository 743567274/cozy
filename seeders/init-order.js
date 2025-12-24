'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const {
            Order,
            User,
            Address,
            OrderProduct,
            Product,
            Sku
        } = require('../models');
        const userList = await User.findAll();
        // 随机选择一个用户
        const randomUser = userList[Math.floor(Math.random() * userList.length)];
        console.log('randomUser', randomUser.id)
        const AddressList = await Address.create({
            user_id: randomUser.id,
            name: '张三',
            phone_number: '13888888888',
            province: '广东省',
            city: '深圳市',
            region: '宝安区',
            detail_address: '深圳宝安大道',
            default: 1
        });
        const dataProduct = await Product.findOne();
        const dataSku = await Sku.findOne();
        // 加入普通商品订单
        const dataOrder = await Order.create({
            user_id: randomUser.id,
            type: 2,
            total_price: 99.99,
            status: 1,
            pay_time: new Date(),
            shipping_address: AddressList.id,
            description: '这是订单说明',
            remarks: '这是订单备注'
        })
        const orderProduct = await OrderProduct.create({
            order_id: dataOrder.id,
            product_id: dataProduct.id,
            sku_id: dataSku.id,
            quantity: 1,
            unit_price: 99.99,
            is_custom: 2,
            submitted: {
                image: 'https://picsum.photos/id/237/200/300',
                thumbnail: 'https://picsum.photos/id/237/200/300'
            }
        })
        // 加入定制订单
        const dataOrder1 = await Order.create({
            user_id: randomUser.id,
            type: 1,
            total_price: 9.90,
            status: 1,
            pay_time: new Date(),
            shipping_address: AddressList.id,
            description: '这是订单说明',
            remarks: '这是订单备注',
            customized_data: {
                image: 'https://picsum.photos/id/237/200/300',
                thumbnail: 'https://picsum.photos/id/237/200/300',
                phone:'华为P30',
                model:'液态玻璃壳',
                color:'黑色'
            }
        })
    },

    down: async (queryInterface, Sequelize) => {
    }
};
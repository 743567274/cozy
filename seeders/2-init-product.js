const SnowflakeID = require('snowflake-id').default;
const snowflake = new SnowflakeID({ mid: 1 }); // 机器 ID 自定义
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const { ProductClass, Product, ProductCommission, SpecName, SpecValue, Sku } = require('../models');
        const Class = await ProductClass.create({
            class_name: '我的爱豆',
            desc: '明星图案手机壳',
            share_title: '明星图案手机壳',
            share_desc: '这是一个明星图案手机壳的描述',
            share_img: null
        })
        await ProductClass.create({
            class_name: '薛之谦',
            parent_id: Class.id,
            desc: '薛之谦',
            share_title: '薛之谦',
            share_desc: '薛之谦',
            share_img: null
        })
        await ProductClass.create({
            class_name: '蔡徐坤',
            parent_id: Class.id,
            desc: '蔡徐坤',
            share_title: '蔡徐坤',
            share_desc: '蔡徐坤',
            share_img: null
        })
        // 下面是添加商品
        const dataProduct = await Product.create({
            product_class: 2,
            product_name: '天外来物',
            type: 2,
            image: [
                'http://image1.cozyapp.top/product_main/7370021511618367488/761c34798e7267a4.jpg'
            ],
            video: null,
            detail: [],
            browse: 0,
            description: '天外来物',
            top: false,
            creators_id: null,
            creators_commission: 0,
            is_active: true
        })
        await ProductCommission.create({
            product_id: dataProduct.id,
            commissionLevel: 0,
            firstLevelRate: 0,
            secondLevelRate: 0,
            isActive: false,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const specName = await SpecName.create({
            product_id: dataProduct.id,
            property_name: '图案',
            price: 0,
            original_id: 1757756987757
        })
        console.log('🔍 SpecValue.create?', typeof SpecValue?.create);
        await SpecValue.bulkCreate([
            {
                spec_name_id: specName.id,
                value: '图案1',
                original_value_id: 0
            },
            {
                spec_name_id: specName.id,
                value: '图案2',
                original_value_id: 1
            },
            {
                spec_name_id: specName.id,
                value: '图案3',
                original_value_id: 2
            },
            {
                spec_name_id: specName.id,
                value: '图案4',
                original_value_id: 3
            },
            {
                spec_name_id: specName.id,
                value: '图案5',
                original_value_id: 4
            },
            {
                spec_name_id: specName.id,
                value: '图案6',
                original_value_id: 5
            }
        ])
        await Sku.bulkCreate([
            {
                product_id: dataProduct.id,
                skuId: '1757756987757_0',
                specValueIds: ["1757756987757_0"],
                specValueNames: ["图案1"],
                price: 9.90,
                originalPrice: 19.90,
                stock: 999,
                isActive: true
            },
            {
                product_id: dataProduct.id,
                skuId: '1757756987757_1',
                specValueIds: ["1757756987757_1"],
                specValueNames: ["图案2"],
                price: 9.90,
                originalPrice: 19.90,
                stock: 999,
                isActive: true
            },
            {
                product_id: dataProduct.id,
                skuId: '1757756987757_2',
                specValueIds: ["1757756987757_2"],
                specValueNames: ["图案3"],
                price: 9.90,
                originalPrice: 19.90,
                stock: 999,
                isActive: true
            },
            {
                product_id: dataProduct.id,
                skuId: '1757756987757_3',
                specValueIds: ["1757756987757_3"],
                specValueNames: ["图案4"],
                price: 9.90,
                originalPrice: 19.90,
                stock: 999,
                isActive: true
            },
            {
                product_id: dataProduct.id,
                skuId: '1757756987757_4',
                specValueIds: ["1757756987757_4"],
                specValueNames: ["图案5"],
                price: 9.90,
                originalPrice: 19.90,
                stock: 999,
                isActive: true
            },
            {
                product_id: dataProduct.id,
                skuId: '1757756987757_5',
                specValueIds: ["1757756987757_5"],
                specValueNames: ["图案6"],
                price: 9.90,
                originalPrice: 19.90,
                stock: 999,
                isActive: true
            }
        ])
    },

    down: async (queryInterface, Sequelize) => {

    }
};
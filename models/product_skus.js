'use strict';

module.exports = (sequelize, DataTypes) => {
    const Sku = sequelize.define('Sku', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'product_id',
            references: {
                model: 'Product',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: '关联商品ID'
        },
        skuId: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'sku_id',
            comment: 'SKU ID'
        },
        specValueIds: {
            type: DataTypes.JSON,
            allowNull: false,
            field: 'spec_value_ids',
            comment: 'SKU 规格值 ID'
        },
        specValueNames: {
            type: DataTypes.JSON,
            allowNull: false,
            field: 'spec_value_names',
            comment: 'SKU 规格值名称'
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            },
            comment: 'SKU 价格'
        },
        originalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'original_price',
            validate: {
                min: 0
            },
            comment: 'SKU 原价'
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'SKU 库存'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 1,
            field: 'is_active',
            comment: '是否启用'
        }
    }, {
        tableName: 'skus',
        timestamps: true, // 自动管理 createdAt 和 updatedAt
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        indexes: [ 
            {
                unique: true,
                fields: ['product_id', 'skuId']
            }
        ], // 联合唯一索引，保证每一个商品的SKUID不重复
    });

    // 关联关系
    Sku.associate = function (models) {
        Sku.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return Sku;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
    const ProductCommission = sequelize.define('ProductCommission', {
        // 主键，自增
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        // 关联商品 ID
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Product', // 对应的表名（注意是复数）
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        commissionLevel: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            comment: '佣金级别'
        },
        // 一级佣金比例（以百分比存储，例如：10.5 表示 10.5%）
        firstLevelRate: {
            type: DataTypes.DECIMAL(5, 2), // 最多 5 位数字，2 位小数，如 99.99%
            allowNull: true,
            validate: {
                min: 0,
                max: 100
            },
            defaultValue: 0.0,
            comment: '一级佣金比例'
        },
        // 二级佣金比例
        secondLevelRate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 100
            },
            defaultValue: 0.0,
            comment: '二级佣金比例'
        },
        // 可选：是否启用该佣金配置
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: '是否启用该佣金配置'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'product_commission', // 明确指定表名
        timestamps: true, // 启用 createdAt 和 updatedAt
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        indexes: [
            {
                unique: true,
                fields: ['product_id', 'commissionLevel']
            }
        ]
    });

    // 关联关系
    ProductCommission.associate = function (models) {
        // 与 Product 表关联
        ProductCommission.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return ProductCommission;
};
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    static associate(models) {
      // OrderProduct 属于 Order
      OrderProduct.belongsTo(models.Order, {
        foreignKey: {
          name: 'order_id',
          allowNull: false
        },
        as: 'order',
        targetKey: 'id'
      });

      // OrderProduct 属于 Product
      OrderProduct.belongsTo(models.Product, {
        foreignKey: {
          name: 'product_id',
          allowNull: false
        },
        as: 'product',
        targetKey: 'id'
      });

      // SKU
      OrderProduct.belongsTo(models.Sku, {
        foreignKey: {
          name: 'sku_id',
          allowNull: true
        },
        as: 'sku',
        targetKey: 'id'
      });
    }
  }

  OrderProduct.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.STRING(19),
      allowNull: false,
      comment: '订单id'
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品id'
    },
    sku_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '商品sku_id'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品数量'
    },
    unit_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品单价'
    },
    is_custom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1为普通商品，2为定制商品，3为半定制商品'
    },
    submitted: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      comment: '如果是定制商品，提交的设计图'
    },

  }, {
    sequelize,
    modelName: 'OrderProduct',
    tableName: 'order_products',
    timestamps: false,
    underscored: true,
    autoIncrement: true,
  });

  return OrderProduct;
};

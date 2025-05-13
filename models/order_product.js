'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    static associate(models) {
      // OrderProduct 属于 Order
      OrderProduct.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      });

      // OrderProduct 属于 Product
      OrderProduct.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }

  OrderProduct.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '订单id'
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品id'
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
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: '如果是定制商品，提交的设计图'
    }
  }, {
    sequelize,
    modelName: 'OrderProduct',
    tableName: 'order_products',
    timestamps: false,
    underscored: true
  });

  return OrderProduct;
};

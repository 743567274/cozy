'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // 商品属于一个分类
      Product.belongsTo(models.ProductClass, {
        foreignKey: 'product_class'
      });
      // 创作者ID属于用户
      Product.belongsTo(models.User, {
        foreignKey: 'creatorsId',
        as: 'creators'
      });
    }
  }

  Product.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      comment: '商品名称'
    },
    type: {
      type: DataTypes.ENUM('standard', 'phone_model'),
      allowNull: false,
      comment: '商品类型'
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '商品图片JSON'
    },
    browse: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '商品浏览量'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '商品描述'
    },
    commission: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '佣金分成比例'
    },
    creatorsId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '创作者ID'
    },
    creators_commission: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '创作者佣金分成比例'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '商品是否激活'
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true // 自动处理 created_at 和 updated_at
  });

  return Product;
};

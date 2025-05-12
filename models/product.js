'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // 商品属于一个分类
      Product.belongsTo(models.ProductClass, {
        foreignKey: 'product_class',
        as: 'class'
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
    product_class: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品分类'
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
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品价格，单位为分'
    },
    line_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '商品划线价，单位为分'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '商品描述'
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    underscored: true,
    timestamps: true // 自动处理 created_at 和 updated_at
  });

  return Product;
};

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // 商品属于一个分类
      Product.belongsTo(models.ProductClass, {
        foreignKey: 'product_class',
        as: 'productClass'
      });
      // 创作者ID属于用户
      Product.belongsTo(models.User, {
        foreignKey: 'creatorsId',
        as: 'creators'
      });
      // ✅ 添加：一个商品有多个规格
      Product.hasMany(models.SpecName, {
        foreignKey: 'productId',
        as: 'spec_name'  // 必须与 include 中的 as 一致
      });

      // ✅ 添加：一个商品有多个 SKU
      Product.hasMany(models.Sku, {
        foreignKey: 'product_id',
        as: 'skus'
      });

      // ✅ 添加：一个商品有佣金配置（一对一）
      Product.hasOne(models.ProductCommission, {
        foreignKey: 'product_id',
        as: 'commissionConfig'
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
      type: DataTypes.INTEGER(1),
      allowNull: false,
      comment: '商品类型:[1普通商品,2虚拟商品]'
    },
    image: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '商品图片JSON'
    },
    video: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '商品视频'
    },
    // 商品详情页
    detail: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: '商品详情'
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
    top: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '商品置顶'
    },
    creators_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '创作者ID'
    },
    creators_commission: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '创作者佣金分成比例（以百分之一为单位，如 1050 表示 10.50%）'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '是否启用：0=禁用，1=启用'
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true, // 自动处理 created_at 和 updated_at
    underscored: true
  });

  return Product;
};
